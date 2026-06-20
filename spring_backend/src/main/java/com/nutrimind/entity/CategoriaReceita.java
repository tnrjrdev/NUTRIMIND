package com.nutrimind.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CategoriaReceita")
public class CategoriaReceita extends BaseEntity {

    private String nome;
    private String descricao;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;

    // Mapeada apenas para permitir a cascata na exclusao fisica (Excluir): remover a
    // categoria remove as receitas vinculadas. @JsonIgnore evita recursao na serializacao.
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Receita> receitas = new ArrayList<>();
}
