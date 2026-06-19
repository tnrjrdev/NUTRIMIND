package com.nutrimind.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name = "RestauranteIfood")
public class RestauranteIfood extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoriaId", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    private CategoriaIfood categoria;

    private String nome;
    private String descricao;
    private String telefone;
    private String linkExterno;
    private Integer ordemExibicao = 0;
    private Boolean ativo = true;

    @JsonProperty(value = "categoriaId", access = JsonProperty.Access.READ_ONLY)
    public Long getCategoriaId() {
        return categoria != null ? categoria.getId() : null;
    }
}
