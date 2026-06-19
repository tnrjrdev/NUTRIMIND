package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Dica")
public class Dica extends BaseEntity {

    private String texto;
    private String icone;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;
}
