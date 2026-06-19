package com.nutrimind.web;

import com.nutrimind.entity.ModoPreparo;
import com.nutrimind.repository.ModoPreparoRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/modos-preparo")
public class ModoPreparoController extends CrudController<ModoPreparo> {
    public ModoPreparoController(ModoPreparoRepository repository) {
        super(repository, ModoPreparo.class);
    }
}
