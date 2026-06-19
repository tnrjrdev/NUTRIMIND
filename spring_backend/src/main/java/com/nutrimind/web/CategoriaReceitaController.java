package com.nutrimind.web;

import com.nutrimind.entity.CategoriaReceita;
import com.nutrimind.repository.CategoriaReceitaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/receitas/categorias")
public class CategoriaReceitaController extends CrudController<CategoriaReceita> {
    public CategoriaReceitaController(CategoriaReceitaRepository repository) {
        super(repository, CategoriaReceita.class);
    }
}
