package com.nutrimind.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ModoPreparo")
public class ModoPreparo extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "receitaId", nullable = false)
    @JsonIgnore
    private Receita receita;

    private Integer numeroPasso;
    private String descricao;

    public Receita getReceita() {
        return receita;
    }

    public void setReceita(Receita receita) {
        this.receita = receita;
    }

    public Integer getNumeroPasso() {
        return numeroPasso;
    }

    public void setNumeroPasso(Integer numeroPasso) {
        this.numeroPasso = numeroPasso;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
