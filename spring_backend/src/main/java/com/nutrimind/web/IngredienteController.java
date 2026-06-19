package com.nutrimind.web;

import com.nutrimind.entity.Ingrediente;
import com.nutrimind.repository.IngredienteRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ingredientes")
public class IngredienteController extends CrudController<Ingrediente> {
    public IngredienteController(IngredienteRepository repository) {
        super(repository, Ingrediente.class);
    }
}
