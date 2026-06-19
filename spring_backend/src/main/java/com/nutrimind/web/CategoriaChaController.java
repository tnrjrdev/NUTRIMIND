package com.nutrimind.web;

import com.nutrimind.entity.CategoriaCha;
import com.nutrimind.repository.CategoriaChaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chas/categorias")
public class CategoriaChaController extends CrudController<CategoriaCha> {
    public CategoriaChaController(CategoriaChaRepository repository) {
        super(repository, CategoriaCha.class);
    }
}
