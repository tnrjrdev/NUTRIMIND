package com.nutrimind.web;

import com.nutrimind.entity.CategoriaIfood;
import com.nutrimind.repository.CategoriaIfoodRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ifood/categorias")
public class CategoriaIfoodController extends CrudController<CategoriaIfood> {
    public CategoriaIfoodController(CategoriaIfoodRepository repository) {
        super(repository, CategoriaIfood.class);
    }
}
