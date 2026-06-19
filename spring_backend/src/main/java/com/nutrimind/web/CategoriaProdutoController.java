package com.nutrimind.web;

import com.nutrimind.entity.CategoriaProduto;
import com.nutrimind.repository.CategoriaProdutoRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/produtos/categorias")
public class CategoriaProdutoController extends CrudController<CategoriaProduto> {
    public CategoriaProdutoController(CategoriaProdutoRepository repository) {
        super(repository, CategoriaProduto.class);
    }
}
