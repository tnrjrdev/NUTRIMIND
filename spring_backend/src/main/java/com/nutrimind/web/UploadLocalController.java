package com.nutrimind.web;

import com.nutrimind.storage.LocalArmazenamentoService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Endpoint de mock de S3 para desenvolvimento local.
 * Recebe o binario (PUT direto do frontend sem ser multipart) e salva no disco.
 */
@RestController
@RequestMapping("/api/postagens")
@ConditionalOnProperty(name = "nutrimind.storage.tipo", havingValue = "local", matchIfMissing = true)
public class UploadLocalController {

    private final LocalArmazenamentoService armazenamento;

    public UploadLocalController(LocalArmazenamentoService armazenamento) {
        this.armazenamento = armazenamento;
    }

    @PutMapping("/local-upload")
    @ResponseStatus(HttpStatus.OK)
    public void uploadMockado(@RequestParam("key") String key, HttpServletRequest request) throws IOException {
        byte[] bytes = request.getInputStream().readAllBytes();
        armazenamento.salvarNaKey(bytes, key);
    }
}
