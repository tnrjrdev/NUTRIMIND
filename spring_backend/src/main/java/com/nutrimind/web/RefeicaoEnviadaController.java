package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.nutrimind.entity.RefeicaoEnviada;
import com.nutrimind.entity.TipoRefeicao;
import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.RefeicaoEnviadaRepository;
import com.nutrimind.repository.UsuarioRepository;
import com.nutrimind.web.dto.PostagemDTO;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/refeicoes")
public class RefeicaoEnviadaController {

    private final RefeicaoEnviadaRepository refeicaoRepository;
    private final UsuarioRepository usuarioRepository;

    public RefeicaoEnviadaController(RefeicaoEnviadaRepository refeicaoRepository,
                                     UsuarioRepository usuarioRepository) {
        this.refeicaoRepository = refeicaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Feed permission-aware: o que cada papel ve.
     * - PACIENTE: somente as proprias postagens.
     * - NUTRICIONISTA: postagens dos pacientes vinculados (opcionalmente filtrando por um deles).
     * - ADMIN: tudo (ou de um paciente, se informado).
     */
    @GetMapping
    public List<PostagemDTO> feed(@RequestParam(name = "pacienteId", required = false) Long pacienteId) {
        Usuario logado = usuarioLogado();

        List<RefeicaoEnviada> postagens = switch (logado.getPapelEfetivo()) {
            case PACIENTE -> refeicaoRepository.feedDoPaciente(logado.getId());
            case NUTRICIONISTA -> {
                List<RefeicaoEnviada> feed = refeicaoRepository.feedDoNutricionista(logado.getId());
                yield pacienteId == null ? feed
                        : feed.stream().filter(r -> r.getUsuario().getId().equals(pacienteId)).toList();
            }
            case ADMIN -> pacienteId != null
                    ? refeicaoRepository.feedDoPaciente(pacienteId)
                    : refeicaoRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        };

        return postagens.stream().map(PostagemDTO::de).toList();
    }

    @PostMapping
    public ResponseEntity<PostagemDTO> create(@RequestBody JsonNode body) {
        Usuario paciente = usuarioLogado();

        RefeicaoEnviada refeicao = new RefeicaoEnviada();
        refeicao.setUsuario(paciente);
        if (body.hasNonNull("descricao")) {
            refeicao.setDescricao(body.get("descricao").asText());
        }
        if (body.hasNonNull("imagemUrl")) {
            refeicao.setImagemUrl(body.get("imagemUrl").asText());
        }
        if (body.hasNonNull("capturadaEm")) {
            refeicao.setCapturadaEm(body.get("capturadaEm").asText());
        }
        if (body.hasNonNull("tipoRefeicao")) {
            refeicao.setTipoRefeicao(parseTipo(body.get("tipoRefeicao").asText()));
        }

        RefeicaoEnviada salva = refeicaoRepository.save(refeicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(PostagemDTO.de(salva));
    }

    @PatchMapping("/{id}/curtir")
    public ResponseEntity<PostagemDTO> curtir(@PathVariable Long id) {
        Usuario logado = usuarioLogado();
        RefeicaoEnviada refeicao = refeicaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Refeicao nao encontrada"));

        if (!podeAcessar(logado, refeicao)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sem permissao para esta postagem");
        }

        refeicao.setCurtido(!Boolean.TRUE.equals(refeicao.getCurtido()));
        return ResponseEntity.ok(PostagemDTO.de(refeicaoRepository.save(refeicao)));
    }

    // ===== Helpers =====

    /** Regra central de acesso a uma postagem (mesma logica do recorte do feed). */
    private boolean podeAcessar(Usuario logado, RefeicaoEnviada refeicao) {
        Long autorId = refeicao.getUsuario().getId();
        return switch (logado.getPapelEfetivo()) {
            case ADMIN -> true;
            case PACIENTE -> autorId.equals(logado.getId());
            case NUTRICIONISTA -> logado.getId().equals(refeicao.getUsuario().getNutricionistaId());
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
