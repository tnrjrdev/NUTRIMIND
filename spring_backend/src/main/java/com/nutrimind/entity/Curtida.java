package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "curtida",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"postagem_id", "autor_id"})
    }
)
public class Curtida extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postagem_id", nullable = false)
    private PostagemAlimentar postagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    public Curtida() {}

    public Curtida(PostagemAlimentar postagem, Usuario autor) {
        this.postagem = postagem;
        this.autor = autor;
    }

    public PostagemAlimentar getPostagem() {
        return postagem;
    }

    public void setPostagem(PostagemAlimentar postagem) {
        this.postagem = postagem;
    }

    public Usuario getAutor() {
        return autor;
    }

    public void setAutor(Usuario autor) {
        this.autor = autor;
    }
}
