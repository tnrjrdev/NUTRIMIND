package com.nutrimind.web;

import com.nutrimind.entity.Cha;
import com.nutrimind.repository.ChaRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chas")
public class ChaController extends CrudController<Cha> {
    public ChaController(ChaRepository repository) {
        super(repository, Cha.class);
    }
}
