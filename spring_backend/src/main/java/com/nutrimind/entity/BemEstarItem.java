package com.nutrimind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "BemEstarItem")
public class BemEstarItem extends BaseEntity {

    private String nome;
    private String descricaoCurta;
    private String descricaoDetalhada;
    private String telefone;
    private Boolean whatsapp = false;
    private String instagram;
    private String site;
    private String midiaUrl;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;
}
