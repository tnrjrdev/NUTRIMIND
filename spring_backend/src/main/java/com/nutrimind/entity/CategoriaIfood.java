package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "CategoriaIfood")
public class CategoriaIfood extends BaseEntity {

    private String nome;
    private String descricao;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;
}
