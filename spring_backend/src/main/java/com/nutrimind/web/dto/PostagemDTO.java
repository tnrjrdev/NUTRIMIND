package com.nutrimind.web.dto;

import com.nutrimind.entity.PostagemAlimentar;
import java.time.format.DateTimeFormatter;

/**
 * Representacao publica de uma postagem alimentar no feed.
 * Evita serializar a entidade Usuario (que carrega dados sensiveis) — expoe
 * apenas {id, nome} do autor.
 */
public record PostagemDTO(
        Long id,
        String legenda,
        String imagemUrl,
        String tipoRefeicao,
        String capturadaEm,
        Integer nivelFome,
        String emocao,
        Boolean curtido,
        Long totalCurtidas,
        String createdAt,
        AutorDTO usuario) {

    public record AutorDTO(Long id, String nome) {
    }

    /**
     * @param imagemUrl URL resolvida para exibir a imagem: URL assinada.
     */
    public static PostagemDTO de(PostagemAlimentar p, String imagemUrl, boolean curtido, long totalCurtidas) {
        String capturadaEmStr = p.getCapturadaEm() != null ? p.getCapturadaEm().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null;
        return new PostagemDTO(
                p.getId(),
                p.getLegenda(),
                imagemUrl,
                p.getTipoRefeicao() != null ? p.getTipoRefeicao().name() : null,
                capturadaEmStr,
                p.getNivelFome(),
                p.getEmocao(),
                curtido,
                totalCurtidas,
                p.getCreatedAt(),
                new AutorDTO(p.getPaciente().getId(), p.getPaciente().getNome()));
    }
}
