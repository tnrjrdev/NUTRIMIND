package com.nutrimind.web;

import com.nutrimind.entity.Produto;
import com.nutrimind.repository.ProdutoRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController extends CrudController<Produto> {
    public ProdutoController(ProdutoRepository repository) {
        super(repository, Produto.class);
    }
}
