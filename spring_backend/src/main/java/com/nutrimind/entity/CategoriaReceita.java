package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "CategoriaReceita")
public class CategoriaReceita extends BaseEntity {

    private String nome;
    private String descricao;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;
}
