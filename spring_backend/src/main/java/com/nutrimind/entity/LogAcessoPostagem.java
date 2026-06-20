package com.nutrimind.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "log_acesso_postagem")
public class LogAcessoPostagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postagem_id", nullable = false)
    private PostagemAlimentar postagem;

    @Column(nullable = false)
    private String acao;

    @Column(nullable = false)
    private String ip;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public LogAcessoPostagem() {
    }

    public LogAcessoPostagem(Usuario usuario, PostagemAlimentar postagem, String acao, String ip) {
        this.usuario = usuario;
        this.postagem = postagem;
        this.acao = acao;
        this.ip = ip;
    }

    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public PostagemAlimentar getPostagem() {
        return postagem;
    }

    public void setPostagem(PostagemAlimentar postagem) {
        this.postagem = postagem;
    }

    public String getAcao() {
        return acao;
    }

    public void setAcao(String acao) {
        this.acao = acao;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
