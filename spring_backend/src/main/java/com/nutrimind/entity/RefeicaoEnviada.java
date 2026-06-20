package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "refeicao_enviada")
public class RefeicaoEnviada extends BaseEntity {

    /** Paciente autor da postagem (a coluna usuario_id e mantida por compatibilidade). */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private String descricao;

    @jakarta.persistence.Column(columnDefinition = "TEXT")
    private String imagemUrl;

    @Enumerated(EnumType.STRING)
    private TipoRefeicao tipoRefeicao;

    /** Momento em que a refeicao foi consumida (opcional, ISO-8601, distinto de createdAt). */
    private String capturadaEm;

    private Boolean curtido = false;

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public TipoRefeicao getTipoRefeicao() {
        return tipoRefeicao;
    }

    public void setTipoRefeicao(TipoRefeicao tipoRefeicao) {
        this.tipoRefeicao = tipoRefeicao;
    }

    public String getCapturadaEm() {
        return capturadaEm;
    }

    public void setCapturadaEm(String capturadaEm) {
        this.capturadaEm = capturadaEm;
    }

    public Boolean getCurtido() {
        return curtido;
    }

    public void setCurtido(Boolean curtido) {
        this.curtido = curtido;
    }
}
