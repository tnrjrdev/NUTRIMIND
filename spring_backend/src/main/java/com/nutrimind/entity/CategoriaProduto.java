package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "CategoriaProduto")
public class CategoriaProduto extends BaseEntity {

    private String nome;
    private String descricao;
    private String imagem;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;
}
