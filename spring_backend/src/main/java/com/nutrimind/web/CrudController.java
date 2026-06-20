package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nutrimind.entity.BaseEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CRUD generico que reproduz o comportamento dos ModelViewSet do DRF:
 * - listagem (com filtro opcional por chave estrangeira via querystring, ex.: ?categoriaId=2)
 * - detalhe, criacao, atualizacao (PUT/PATCH) e remocao
 * - relacoes @ManyToOne sao recebidas como "<campo>Id" no corpo e resolvidas aqui.
 *
 * Subclasses apenas informam o repositorio, o tipo e o caminho base (@RequestMapping).
 */
public abstract class CrudController<T> {

    protected final JpaRepository<T, Long> repository;
    protected final Class<T> type;

    @PersistenceContext
    protected EntityManager entityManager;

    @Autowired
    protected ObjectMapper objectMapper;

    protected CrudController(JpaRepository<T, Long> repository, Class<T> type) {
        this.repository = repository;
        this.type = type;
    }

    @GetMapping
    public List<T> list(@RequestParam MultiValueMap<String, String> params) {
        List<T> all = repository.findAll();
        if (params.isEmpty()) {
            return all;
        }
        return all.stream().filter(e -> matchesFilters(e, params)).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public T get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public T create(@RequestBody JsonNode body) {
        try {
            T entity = objectMapper.treeToValue(body, type);
            applyForeignKeys(entity, body);
            return repository.save(entity);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public T update(@PathVariable Long id, @RequestBody JsonNode body) {
        return doUpdate(id, body);
    }

    @PatchMapping("/{id}")
    public T patch(@PathVariable Long id, @RequestBody JsonNode body) {
        return doUpdate(id, body);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,
                       @RequestParam(name = "hard", defaultValue = "false") boolean hard) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        // Padrao: "Inativar" = soft delete (ativo=false) quando a entidade tem o campo.
        // ?hard=true: "Excluir" = remocao fisica (cascateia filhos de agregados;
        // bloqueada por FK quando ha dependentes -> 409 via GlobalExceptionHandler).
        if (!hard && setAtivoFalse(entity)) {
            repository.save(entity);
        } else {
            repository.delete(entity);
        }
    }

    private boolean setAtivoFalse(T entity) {
        try {
            Field ativo = type.getDeclaredField("ativo");
            ativo.setAccessible(true);
            ativo.set(entity, false);
            return true;
        } catch (NoSuchFieldException e) {
            return false;
        } catch (IllegalAccessException e) {
            throw new IllegalStateException(e);
        }
    }

    protected T doUpdate(Long id, JsonNode body) {
        T entity = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            objectMapper.readerForUpdating(entity).readValue(objectMapper.treeAsTokens(body));
            applyForeignKeys(entity, body);
            return repository.save(entity);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    /** Resolve cada relacao @ManyToOne a partir do campo "<nome>Id" presente no corpo. */
    protected void applyForeignKeys(T entity, JsonNode body) {
        for (Field field : type.getDeclaredFields()) {
            if (!field.isAnnotationPresent(ManyToOne.class)) {
                continue;
            }
            String key = field.getName() + "Id";
            if (body.has(key) && !body.get(key).isNull()) {
                Object ref = entityManager.find(field.getType(), body.get(key).asLong());
                if (ref == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Referencia inexistente em " + key);
                }
                setField(field, entity, ref);
            }
        }
    }

    private boolean matchesFilters(T entity, MultiValueMap<String, String> params) {
        for (Field field : type.getDeclaredFields()) {
            if (!field.isAnnotationPresent(ManyToOne.class)) {
                continue;
            }
            String key = field.getName() + "Id";
            if (params.containsKey(key)) {
                Long actual = foreignKeyId(entity, field);
                if (actual == null || !actual.toString().equals(params.getFirst(key))) {
                    return false;
                }
            }
        }
        return true;
    }

    private Long foreignKeyId(T entity, Field field) {
        field.setAccessible(true);
        try {
            Object related = field.get(entity);
            return related instanceof BaseEntity be ? be.getId() : null;
        } catch (IllegalAccessException e) {
            throw new IllegalStateException(e);
        }
    }

    private void setField(Field field, Object target, Object value) {
        field.setAccessible(true);
        try {
            field.set(target, value);
        } catch (IllegalAccessException e) {
            throw new IllegalStateException(e);
        }
    }
}
