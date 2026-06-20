package com.nutrimind.web.dto;

import com.nutrimind.entity.Notificacao;

public record NotificacaoDTO(
        Long id,
        String mensagem,
        boolean lida,
        String linkDestino,
        String createdAt) {

    public static NotificacaoDTO de(Notificacao n) {
        return new NotificacaoDTO(
                n.getId(),
                n.getMensagem(),
                n.isLida(),
                n.getLinkDestino(),
                n.getCreatedAt()
        );
    }
}
