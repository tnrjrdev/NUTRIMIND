package com.nutrimind.web;

import com.nutrimind.entity.CategoriaSubstituicao;
import com.nutrimind.repository.CategoriaSubstituicaoRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/substituicoes/categorias")
public class CategoriaSubstituicaoController extends CrudController<CategoriaSubstituicao> {
    public CategoriaSubstituicaoController(CategoriaSubstituicaoRepository repository) {
        super(repository, CategoriaSubstituicao.class);
    }
}
