package com.nutrimind.web;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Traduz erros de persistencia para respostas HTTP limpas (com JSON), em vez de
 * devolver um 500 cru ao frontend.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * O driver SQLite reporta violacao de chave estrangeira como SQLITE_CONSTRAINT
     * sem SQLState, entao o Spring nao a classifica como DataIntegrityViolationException
     * (vem como JpaSystemException). Detectamos pela mensagem da causa raiz.
     *
     * Caso tipico: excluir uma categoria que ainda possui receitas/itens (ON DELETE RESTRICT).
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> handlePersistence(DataAccessException ex) {
        String rootMessage = ex.getMostSpecificCause().getMessage();
        if (rootMessage != null && rootMessage.toLowerCase().contains("constraint failed")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "message", "Nao e possivel excluir: existem registros vinculados a este item. "
                            + "Remova ou mova os itens dependentes antes de excluir."));
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "Erro ao processar a operacao."));
    }
}
