package com.nutrimind.web;

import com.nutrimind.entity.CategoriaFornecedor;
import com.nutrimind.repository.CategoriaFornecedorRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fornecedores/categorias")
public class CategoriaFornecedorController extends CrudController<CategoriaFornecedor> {
    public CategoriaFornecedorController(CategoriaFornecedorRepository repository) {
        super(repository, CategoriaFornecedor.class);
    }
}
