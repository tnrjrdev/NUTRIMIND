package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.nutrimind.entity.RefeicaoEnviada;
import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.RefeicaoEnviadaRepository;
import com.nutrimind.repository.UsuarioRepository;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/refeicoes")
public class RefeicaoEnviadaController {

    private final RefeicaoEnviadaRepository refeicaoRepository;
    private final UsuarioRepository usuarioRepository;

    public RefeicaoEnviadaController(RefeicaoEnviadaRepository refeicaoRepository, UsuarioRepository usuarioRepository) {
        this.refeicaoRepository = refeicaoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<RefeicaoEnviada> listAll() {
        return refeicaoRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @PostMapping
    public ResponseEntity<RefeicaoEnviada> create(@RequestBody JsonNode body) {
        Long userId = getAuthenticatedUserId();
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao encontrado"));

        RefeicaoEnviada refeicao = new RefeicaoEnviada();
        refeicao.setUsuario(usuario);

        if (body.has("descricao")) {
            refeicao.setDescricao(body.get("descricao").asText());
        }
        if (body.has("imagemUrl")) {
            refeicao.setImagemUrl(body.get("imagemUrl").asText());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(refeicaoRepository.save(refeicao));
    }

    @PatchMapping("/{id}/curtir")
    public ResponseEntity<RefeicaoEnviada> curtir(@PathVariable Long id) {
        RefeicaoEnviada refeicao = refeicaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Refeicao nao encontrada"));

        refeicao.setCurtido(!Boolean.TRUE.equals(refeicao.getCurtido()));
        return ResponseEntity.ok(refeicaoRepository.save(refeicao));
    }

    private Long getAuthenticatedUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado");
    }
}
