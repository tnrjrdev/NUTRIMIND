package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.nutrimind.entity.CategoriaReceita;
import com.nutrimind.entity.Ingrediente;
import com.nutrimind.entity.ModoPreparo;
import com.nutrimind.entity.Receita;
import com.nutrimind.repository.ReceitaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Receita e um agregado: a criacao/atualizacao recebe os arrays "ingredientes" e
 * "modosPreparo" no corpo e os persiste junto (estrategia de substituicao completa),
 * algo que o frontend ja envia e consome em /receitas/{id}.
 */
@RestController
@RequestMapping("/api/receitas")
public class ReceitaController extends CrudController<Receita> {

    public ReceitaController(ReceitaRepository repository) {
        super(repository, Receita.class);
    }

    @Override
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Receita create(@RequestBody JsonNode body) {
        Receita receita = new Receita();
        apply(receita, body);
        return repository.save(receita);
    }

    @Override
    protected Receita doUpdate(Long id, JsonNode body) {
        Receita receita = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(receita, body);
        return repository.save(receita);
    }

    private void apply(Receita receita, JsonNode body) {
        if (body.has("nome")) {
            receita.setNome(text(body, "nome"));
        }
        if (body.has("descricao")) {
            receita.setDescricao(text(body, "descricao"));
        }
        if (body.has("imagem")) {
            receita.setImagem(text(body, "imagem"));
        }
        if (body.has("tempoPreparo")) {
            receita.setTempoPreparo(text(body, "tempoPreparo"));
        }
        if (body.has("destaque")) {
            receita.setDestaque(body.get("destaque").asBoolean(false));
        }
        if (body.has("ativo")) {
            receita.setAtivo(body.get("ativo").asBoolean(true));
        }
        if (body.hasNonNull("categoriaId")) {
            CategoriaReceita categoria = entityManager.find(
                    CategoriaReceita.class, body.get("categoriaId").asLong());
            if (categoria == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoria inexistente");
            }
            receita.setCategoria(categoria);
        }

        if (body.has("ingredientes")) {
            receita.getIngredientes().clear();
            int ordem = 0;
            for (JsonNode node : body.get("ingredientes")) {
                Ingrediente ingrediente = new Ingrediente();
                ingrediente.setDescricao(text(node, "descricao"));
                ingrediente.setOrdemExibicao(intOr(node, "ordemExibicao", ordem));
                ingrediente.setReceita(receita);
                receita.getIngredientes().add(ingrediente);
                ordem++;
            }
        }

        if (body.has("modosPreparo")) {
            receita.getModosPreparo().clear();
            int passo = 1;
            for (JsonNode node : body.get("modosPreparo")) {
                ModoPreparo modo = new ModoPreparo();
                modo.setDescricao(text(node, "descricao"));
                modo.setNumeroPasso(intOr(node, "numeroPasso", passo));
                modo.setReceita(receita);
                receita.getModosPreparo().add(modo);
                passo++;
            }
        }
    }

    private static String text(JsonNode node, String key) {
        JsonNode value = node.get(key);
        return value == null || value.isNull() ? null : value.asText();
    }

    private static int intOr(JsonNode node, String key, int fallback) {
        JsonNode value = node.get(key);
        return value == null || value.isNull() ? fallback : value.asInt();
    }
}
