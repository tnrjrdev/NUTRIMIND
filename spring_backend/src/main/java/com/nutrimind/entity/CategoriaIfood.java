package com.nutrimind.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CategoriaIfood")
public class CategoriaIfood extends BaseEntity {

    private String nome;
    private String descricao;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<RestauranteIfood> restaurantes = new ArrayList<>();
}
