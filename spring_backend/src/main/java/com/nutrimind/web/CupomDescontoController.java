package com.nutrimind.web;

import com.nutrimind.entity.CupomDesconto;
import com.nutrimind.repository.CupomDescontoRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cupons")
public class CupomDescontoController extends CrudController<CupomDesconto> {
    public CupomDescontoController(CupomDescontoRepository repository) {
        super(repository, CupomDesconto.class);
    }
}
