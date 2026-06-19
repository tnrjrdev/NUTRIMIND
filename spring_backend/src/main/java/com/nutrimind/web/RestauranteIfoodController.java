package com.nutrimind.web;

import com.nutrimind.entity.RestauranteIfood;
import com.nutrimind.repository.RestauranteIfoodRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ifood")
public class RestauranteIfoodController extends CrudController<RestauranteIfood> {
    public RestauranteIfoodController(RestauranteIfoodRepository repository) {
        super(repository, RestauranteIfood.class);
    }
}
