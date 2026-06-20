package com.nutrimind.web;

import com.nutrimind.entity.Notificacao;
import com.nutrimind.repository.NotificacaoRepository;
import com.nutrimind.web.dto.NotificacaoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.transaction.Transactional;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoController(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    @GetMapping
    public Page<NotificacaoDTO> listar(Pageable pageable) {
        return notificacaoRepository.findByUsuarioIdOrderByCreatedAtDesc(usuarioLogadoId(), pageable)
                .map(NotificacaoDTO::de);
    }

    @GetMapping("/nao-lidas")
    public Map<String, Long> countNaoLidas() {
        return Map.of("count", notificacaoRepository.countNaoLidas(usuarioLogadoId()));
    }

    @PostMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable("id") Long id) {
        Notificacao notif = notificacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificacao nao encontrada"));

        if (!notif.getUsuario().getId().equals(usuarioLogadoId())) {
             throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado");
        }

        notif.setLida(true);
        notificacaoRepository.save(notif);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @PostMapping("/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLidas() {
        notificacaoRepository.marcarTodasComoLidas(usuarioLogadoId());
        return ResponseEntity.ok().build();
    }

    private Long usuarioLogadoId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Long userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado");
        }
        return userId;
    }
}
