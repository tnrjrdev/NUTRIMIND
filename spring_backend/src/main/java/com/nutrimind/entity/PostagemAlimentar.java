package com.nutrimind.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "postagem_alimentar")
public class PostagemAlimentar extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Usuario paciente;

    private String legenda;

    @Enumerated(EnumType.STRING)
    private TipoRefeicao tipoRefeicao;

    @Column(nullable = false)
    private String imagemKey;

    @Enumerated(EnumType.STRING)
    private ImagemStatus imagemStatus = ImagemStatus.PENDENTE;

    private LocalDateTime capturadaEm;

    @Column(name = "nivel_fome")
    private Integer nivelFome;

    @Column(name = "emocao")
    private String emocao;
    public Usuario getPaciente() {
        return paciente;
    }

    public void setPaciente(Usuario paciente) {
        this.paciente = paciente;
    }

    public String getLegenda() {
        return legenda;
    }

    public void setLegenda(String legenda) {
        this.legenda = legenda;
    }

    public TipoRefeicao getTipoRefeicao() {
        return tipoRefeicao;
    }

    public void setTipoRefeicao(TipoRefeicao tipoRefeicao) {
        this.tipoRefeicao = tipoRefeicao;
    }

    public String getImagemKey() {
        return imagemKey;
    }

    public void setImagemKey(String imagemKey) {
        this.imagemKey = imagemKey;
    }

    public ImagemStatus getImagemStatus() {
        return imagemStatus;
    }

    public void setImagemStatus(ImagemStatus imagemStatus) {
        this.imagemStatus = imagemStatus;
    }

    public LocalDateTime getCapturadaEm() {
        return capturadaEm;
    }

    public void setCapturadaEm(LocalDateTime capturadaEm) {
        this.capturadaEm = capturadaEm;
    }

    public Integer getNivelFome() {
        return nivelFome;
    }

    public void setNivelFome(Integer nivelFome) {
        this.nivelFome = nivelFome;
    }

    public String getEmocao() {
        return emocao;
    }

    public void setEmocao(String emocao) {
        this.emocao = emocao;
    }
}
