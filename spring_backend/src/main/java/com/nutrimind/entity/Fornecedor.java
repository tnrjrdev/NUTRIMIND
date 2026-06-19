package com.nutrimind.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Fornecedor")
public class Fornecedor extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "categoriaId", nullable = false)
    private CategoriaFornecedor categoria;

    private String nome;
    private String descricaoCurta;
    private String descricaoDetalhada;
    private String endereco;
    private String telefone;
    private String whatsapp;
    private String instagram;
    private String site;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;

    @OneToMany(mappedBy = "fornecedor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CupomDesconto> cupons = new ArrayList<>();

    @JsonProperty(value = "categoriaId", access = JsonProperty.Access.READ_ONLY)
    public Long getCategoriaId() {
        return categoria != null ? categoria.getId() : null;
    }

    public CategoriaFornecedor getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaFornecedor categoria) {
        this.categoria = categoria;
    }

    public List<CupomDesconto> getCupons() {
        return cupons;
    }
}
