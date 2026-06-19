package com.nutrimind.web;

import com.nutrimind.entity.ItemSubstituicao;
import com.nutrimind.repository.ItemSubstituicaoRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/substituicoes")
public class ItemSubstituicaoController extends CrudController<ItemSubstituicao> {
    public ItemSubstituicaoController(ItemSubstituicaoRepository repository) {
        super(repository, ItemSubstituicao.class);
    }
}
