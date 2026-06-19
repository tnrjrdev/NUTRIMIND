package com.nutrimind.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Cha")
public class Cha extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categoriaId", nullable = false)
    private CategoriaCha categoria;

    private String nome;
    private String formaUtilizacao;
    private String posologia;
    private String contraindicacoes;
    private String observacoes;
    private Boolean usoAdulto = false;
    private Boolean usoInfantil = false;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;

    @JsonProperty(value = "categoriaId", access = JsonProperty.Access.READ_ONLY)
    public Long getCategoriaId() {
        return categoria != null ? categoria.getId() : null;
    }
}
