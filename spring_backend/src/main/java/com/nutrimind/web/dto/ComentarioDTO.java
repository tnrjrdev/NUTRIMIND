package com.nutrimind.web.dto;

import com.nutrimind.entity.Comentario;

public record ComentarioDTO(
        Long id,
        String texto,
        String createdAt,
        AutorDTO autor) {

    public record AutorDTO(Long id, String nome) {}

    public static ComentarioDTO de(Comentario c) {
        return new ComentarioDTO(
                c.getId(),
                c.getTexto(),
                c.getCreatedAt(),
                new AutorDTO(c.getAutor().getId(), c.getAutor().getNome())
        );
    }
}
