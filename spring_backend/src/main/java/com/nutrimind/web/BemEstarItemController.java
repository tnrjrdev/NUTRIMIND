package com.nutrimind.web;

import com.nutrimind.entity.BemEstarItem;
import com.nutrimind.repository.BemEstarItemRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bem-estar")
public class BemEstarItemController extends CrudController<BemEstarItem> {
    public BemEstarItemController(BemEstarItemRepository repository) {
        super(repository, BemEstarItem.class);
    }
}
