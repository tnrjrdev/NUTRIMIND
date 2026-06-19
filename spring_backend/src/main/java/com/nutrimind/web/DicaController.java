package com.nutrimind.web;

import com.nutrimind.entity.Dica;
import com.nutrimind.repository.DicaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dicas")
public class DicaController extends CrudController<Dica> {
    public DicaController(DicaRepository repository) {
        super(repository, Dica.class);
    }
}
