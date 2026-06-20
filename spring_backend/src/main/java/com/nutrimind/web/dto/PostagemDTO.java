package com.nutrimind.web.dto;

import com.nutrimind.entity.RefeicaoEnviada;

/**
 * Representacao publica de uma postagem alimentar no feed.
 * Evita serializar a entidade Usuario (que carrega dados sensiveis) — expoe
 * apenas {id, nome} do autor. Mantem o contrato consumido pelo frontend atual
 * (campos imagemUrl, descricao, curtido, usuario) e adiciona tipoRefeicao/capturadaEm.
 */
public record PostagemDTO(
        Long id,
        String descricao,
        String imagemUrl,
        String tipoRefeicao,
        String capturadaEm,
        Boolean curtido,
        String createdAt,
        AutorDTO usuario) {

    public record AutorDTO(Long id, String nome) {
    }

    public static PostagemDTO de(RefeicaoEnviada r) {
        return new PostagemDTO(
                r.getId(),
                r.getDescricao(),
                r.getImagemUrl(),
                r.getTipoRefeicao() != null ? r.getTipoRefeicao().name() : null,
                r.getCapturadaEm(),
                r.getCurtido(),
                r.getCreatedAt(),
                new AutorDTO(r.getUsuario().getId(), r.getUsuario().getNome()));
    }
}
