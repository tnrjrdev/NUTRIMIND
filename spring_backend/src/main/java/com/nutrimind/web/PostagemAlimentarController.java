package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.nutrimind.entity.Comentario;
import com.nutrimind.entity.Curtida;
import com.nutrimind.entity.PostagemAlimentar;
import com.nutrimind.entity.TipoRefeicao;
import com.nutrimind.entity.Usuario;
import com.nutrimind.entity.ImagemStatus;
import com.nutrimind.entity.LogAcessoPostagem;
import com.nutrimind.event.InteracaoCriadaEvent;
import com.nutrimind.event.PostagemCriadaEvent;
import com.nutrimind.repository.ComentarioRepository;
import com.nutrimind.repository.CurtidaRepository;
import com.nutrimind.repository.LogAcessoPostagemRepository;
import com.nutrimind.repository.PostagemAlimentarRepository;
import com.nutrimind.repository.PostagemAlimentarSpecs;
import com.nutrimind.repository.UsuarioRepository;
import com.nutrimind.storage.ArmazenamentoService;
import com.nutrimind.storage.UrlAssinada;
import com.nutrimind.web.dto.ComentarioDTO;
import com.nutrimind.web.dto.PostagemDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/postagens")
public class PostagemAlimentarController {

    private static final Duration VALIDADE_URL = Duration.ofMinutes(15);

    private final PostagemAlimentarRepository postagemRepository;
    private final CurtidaRepository curtidaRepository;
    private final ComentarioRepository comentarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final LogAcessoPostagemRepository logAcessoRepository;
    private final ArmazenamentoService armazenamento;
    private final UrlAssinada urlAssinada;
    private final ApplicationEventPublisher eventPublisher;
    private final String baseUrl;

    public PostagemAlimentarController(PostagemAlimentarRepository postagemRepository,
                                       CurtidaRepository curtidaRepository,
                                       ComentarioRepository comentarioRepository,
                                       UsuarioRepository usuarioRepository,
                                       LogAcessoPostagemRepository logAcessoRepository,
                                       ArmazenamentoService armazenamento,
                                       UrlAssinada urlAssinada,
                                       ApplicationEventPublisher eventPublisher,
                                       @Value("${nutrimind.app.base-url}") String baseUrl) {
        this.postagemRepository = postagemRepository;
        this.curtidaRepository = curtidaRepository;
        this.comentarioRepository = comentarioRepository;
        this.usuarioRepository = usuarioRepository;
        this.logAcessoRepository = logAcessoRepository;
        this.armazenamento = armazenamento;
        this.urlAssinada = urlAssinada;
        this.eventPublisher = eventPublisher;
        this.baseUrl = baseUrl;
    }

    public record UploadReq(String contentType, long tamanhoBytes) {}

    @PostMapping("/upload-url")
    public Map<String, String> gerarUploadUrl(@RequestBody UploadReq req) {
        if (!List.of("image/jpeg", "image/png", "image/webp").contains(req.contentType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato nao permitido");
        }
        if (req.tamanhoBytes() > 8 * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Maximo 8MB");
        }
        Usuario logado = usuarioLogado();
        ArmazenamentoService.UploadUrlInfo info = armazenamento.gerarUrlUpload(req.contentType(), req.tamanhoBytes(), logado.getId());
        return Map.of("uploadUrl", info.uploadUrl(), "imagemKey", info.imagemKey());
    }

    @GetMapping("/imagem/{*key}")
    public ResponseEntity<byte[]> imagem(@PathVariable("key") String key,
                                         @RequestParam("exp") long exp,
                                         @RequestParam("sig") String sig) {
        if (key.startsWith("/")) {
            key = key.substring(1);
        }
        urlAssinada.verificar(key, exp, sig);
        ArmazenamentoService.RecursoArmazenado recurso = armazenamento.carregar(key);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(recurso.contentType()))
                .cacheControl(CacheControl.maxAge(VALIDADE_URL).cachePrivate())
                .body(recurso.conteudo());
    }

    @GetMapping
    public Page<PostagemDTO> feed(
            @RequestParam(name = "pacienteId", required = false) Long pacienteId,
            @RequestParam(name = "tipo", required = false) String tipo,
            @RequestParam(name = "dataIni", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataIni,
            @RequestParam(name = "dataFim", required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            Pageable pageable,
            HttpServletRequest request
    ) {
        Usuario logado = usuarioLogado();

        Specification<PostagemAlimentar> spec = switch (logado.getPapelEfetivo()) {
            case PACIENTE -> PostagemAlimentarSpecs.doPaciente(logado.getId());
            case NUTRICIONISTA -> PostagemAlimentarSpecs.dosPacientesDe(logado.getId());
            case ADMIN -> Specification.where(null);
        };

        TipoRefeicao tipoEnum = (tipo != null && !tipo.isBlank()) ? parseTipo(tipo) : null;
        spec = spec.and(PostagemAlimentarSpecs.filtros(pacienteId, tipoEnum, dataIni, dataFim));

        Page<PostagemAlimentar> page = postagemRepository.findAll(spec, pageable);
        
        // Log de acesso para compliance LGPD se for o nutricionista consultando dados
        if (logado.getPapelEfetivo() == com.nutrimind.entity.Papel.NUTRICIONISTA) {
            String ip = request.getRemoteAddr();
            page.getContent().forEach(p -> {
                if (!p.getPaciente().getId().equals(logado.getId())) {
                    logAcessoRepository.save(new LogAcessoPostagem(logado, p, "VISUALIZAR_FEED", ip));
                }
            });
        }

        return page.map(p -> toDTO(p, logado));
    }

    @GetMapping("/{id}")
    public PostagemDTO getById(@PathVariable("id") Long id, HttpServletRequest request) {
        Usuario logado = usuarioLogado();
        PostagemAlimentar postagem = postagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Postagem não encontrada"));

        if (!podeAcessar(logado, postagem)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
        
        if (!postagem.getPaciente().getId().equals(logado.getId())) {
            logAcessoRepository.save(new LogAcessoPostagem(logado, postagem, "VISUALIZAR_DETALHE", request.getRemoteAddr()));
        }

        return toDTO(postagem, logado);
    }

    @PostMapping
    public ResponseEntity<PostagemDTO> create(@RequestBody JsonNode body) {
        Usuario paciente = usuarioLogado();

        if (paciente.getPapelEfetivo() != com.nutrimind.entity.Papel.PACIENTE) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Somente pacientes podem criar postagens");
        }

        PostagemAlimentar postagem = new PostagemAlimentar();
        postagem.setPaciente(paciente);
        
        if (body.hasNonNull("legenda")) {
            postagem.setLegenda(body.get("legenda").asText());
        } else if (body.hasNonNull("descricao")) {
            postagem.setLegenda(body.get("descricao").asText());
        }
        
        if (body.hasNonNull("imagemKey")) {
            postagem.setImagemKey(body.get("imagemKey").asText());
            postagem.setImagemStatus(ImagemStatus.PRONTA); 
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Imagem obrigatoria (imagemKey)");
        }
        
        if (body.hasNonNull("capturadaEm")) {
            try {
                postagem.setCapturadaEm(LocalDateTime.parse(body.get("capturadaEm").asText(), DateTimeFormatter.ISO_DATE_TIME));
            } catch (Exception e) {
            }
        }
        
        if (body.hasNonNull("tipoRefeicao")) {
            postagem.setTipoRefeicao(parseTipo(body.get("tipoRefeicao").asText()));
        }

        postagem = postagemRepository.save(postagem);
        
        // Dispara evento assíncrono para notificação
        eventPublisher.publishEvent(new PostagemCriadaEvent(postagem, paciente));

        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(postagem, paciente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        Usuario logado = usuarioLogado();
        PostagemAlimentar postagem = postagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Postagem não encontrada"));

        if (!logado.getId().equals(postagem.getPaciente().getId()) && logado.getPapelEfetivo() != com.nutrimind.entity.Papel.ADMIN) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
        
        armazenamento.remover(postagem.getImagemKey());
        postagemRepository.delete(postagem);
        return ResponseEntity.noContent().build();
    }

    // ===== Interações =====

    @PostMapping("/{id}/curtidas")
    public ResponseEntity<Void> curtir(@PathVariable("id") Long id) {
        Usuario logado = usuarioLogado();
        PostagemAlimentar postagem = postagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Postagem não encontrada"));

        if (!podeAcessar(logado, postagem)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
        
        if (logado.getPapelEfetivo() != com.nutrimind.entity.Papel.NUTRICIONISTA) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas usuários com perfil de nutricionista podem curtir");
        }
        
        if (!curtidaRepository.existsByPostagemIdAndAutorId(id, logado.getId())) {
            curtidaRepository.save(new Curtida(postagem, logado));
            eventPublisher.publishEvent(new InteracaoCriadaEvent(postagem, logado, "CURTIDA"));
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/curtidas")
    public ResponseEntity<Void> descurtir(@PathVariable("id") Long id) {
        Usuario logado = usuarioLogado();
        if (logado.getPapelEfetivo() != com.nutrimind.entity.Papel.NUTRICIONISTA) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas usuários com perfil de nutricionista podem descurtir");
        }
        curtidaRepository.findByPostagemIdAndAutorId(id, logado.getId())
                .ifPresent(curtidaRepository::delete);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comentarios")
    public ResponseEntity<ComentarioDTO> comentar(@PathVariable("id") Long id, @RequestBody JsonNode body) {
        Usuario logado = usuarioLogado();
        PostagemAlimentar postagem = postagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Postagem não encontrada"));

        if (!podeAcessar(logado, postagem)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
        
        if (!body.hasNonNull("texto") || body.get("texto").asText().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O texto do comentário é obrigatório");
        }

        Comentario comentario = new Comentario();
        comentario.setPostagem(postagem);
        comentario.setAutor(logado);
        comentario.setTexto(body.get("texto").asText());
        
        ComentarioDTO dto = ComentarioDTO.de(comentarioRepository.save(comentario));
        
        eventPublisher.publishEvent(new InteracaoCriadaEvent(postagem, logado, "COMENTARIO"));
        
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/{id}/comentarios")
    public Page<ComentarioDTO> listarComentarios(@PathVariable("id") Long id, Pageable pageable) {
        Usuario logado = usuarioLogado();
        PostagemAlimentar postagem = postagemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Postagem não encontrada"));

        if (!podeAcessar(logado, postagem)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }
        
        return comentarioRepository.findByPostagemId(id, pageable).map(ComentarioDTO::de);
    }

    // ===== Helpers =====

    private PostagemDTO toDTO(PostagemAlimentar p, Usuario logado) {
        boolean curtido = curtidaRepository.existsByPostagemIdAndAutorId(p.getId(), logado.getId());
        long totalCurtidas = curtidaRepository.countByPostagemId(p.getId());
        return PostagemDTO.de(p, resolverUrlImagem(p), curtido, totalCurtidas);
    }

    private String resolverUrlImagem(PostagemAlimentar p) {
        if (p.getImagemKey() == null) {
            return null;
        }
        String query = urlAssinada.assinarQuery(p.getImagemKey(), VALIDADE_URL);
        return baseUrl + "/api/postagens/imagem/" + p.getImagemKey() + "?" + query;
    }

    private boolean podeAcessar(Usuario logado, PostagemAlimentar postagem) {
        Long autorId = postagem.getPaciente().getId();
        return switch (logado.getPapelEfetivo()) {
            case ADMIN -> true;
            case PACIENTE -> autorId.equals(logado.getId());
            case NUTRICIONISTA -> logado.getId().equals(postagem.getPaciente().getNutricionistaId());
        };
    }

    private TipoRefeicao parseTipo(String valor) {
        try {
            return TipoRefeicao.valueOf(valor);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tipoRefeicao invalido: " + valor);
        }
    }

    private Usuario usuarioLogado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Long userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado");
        }
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao encontrado"));
    }
}
