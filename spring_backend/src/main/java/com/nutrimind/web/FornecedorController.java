package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.nutrimind.entity.CategoriaFornecedor;
import com.nutrimind.entity.CupomDesconto;
import com.nutrimind.entity.Fornecedor;
import com.nutrimind.repository.FornecedorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

/**
 * Fornecedor e um agregado: recebe e persiste a lista "cupons" junto (substituicao completa),
 * espelhando o que o frontend envia no formulario e consome em /fornecedores/{id}.
 */
@RestController
@RequestMapping("/api/fornecedores")
public class FornecedorController extends CrudController<Fornecedor> {

    public FornecedorController(FornecedorRepository repository) {
        super(repository, Fornecedor.class);
    }

    @Override
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Fornecedor create(@RequestBody JsonNode body) {
        Fornecedor fornecedor = new Fornecedor();
        apply(fornecedor, body);
        return repository.save(fornecedor);
    }

    @Override
    protected Fornecedor doUpdate(Long id, JsonNode body) {
        Fornecedor fornecedor = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(fornecedor, body);
        return repository.save(fornecedor);
    }

    private void apply(Fornecedor fornecedor, JsonNode body) {
        // Campos escalares: bind via Jackson (sem os cupons, tratados manualmente abaixo).
        try {
            ObjectNode scalars = body.deepCopy();
            scalars.remove("cupons");
            objectMapper.readerForUpdating(fornecedor).readValue(objectMapper.treeAsTokens(scalars));
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }

        if (body.hasNonNull("categoriaId")) {
            CategoriaFornecedor categoria = entityManager.find(
                    CategoriaFornecedor.class, body.get("categoriaId").asLong());
            if (categoria == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria inexistente");
            }
            fornecedor.setCategoria(categoria);
        }

        if (body.has("cupons")) {
            fornecedor.getCupons().clear();
            for (JsonNode node : body.get("cupons")) {
                CupomDesconto cupom = new CupomDesconto();
                cupom.setCodigo(text(node, "codigo"));
                cupom.setDescricao(text(node, "descricao"));
                cupom.setValidade(text(node, "validade"));
                cupom.setAtivo(node.has("ativo") ? node.get("ativo").asBoolean(true) : true);
                cupom.setFornecedor(fornecedor);
                fornecedor.getCupons().add(cupom);
            }
        }
    }

    private static String text(JsonNode node, String key) {
        JsonNode value = node.get(key);
        return value == null || value.isNull() ? null : value.asText();
    }
}
