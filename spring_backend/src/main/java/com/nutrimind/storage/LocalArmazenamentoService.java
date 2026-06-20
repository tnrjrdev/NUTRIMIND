package com.nutrimind.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Armazenamento em disco local (desenvolvimento). Cada imagem vira um arquivo
 * {uuid}.{ext} dentro de um diretorio configuravel. A key e o proprio nome do arquivo.
 *
 * Em producao basta prover um bean ArmazenamentoService alternativo (S3) com
 * nutrimind.storage.tipo=s3 — nada no resto da aplicacao muda.
 */
@Service
@ConditionalOnProperty(name = "nutrimind.storage.tipo", havingValue = "local", matchIfMissing = true)
public class LocalArmazenamentoService implements ArmazenamentoService {

    private final Path diretorio;
    private final String baseUrl;

    public LocalArmazenamentoService(@Value("${nutrimind.storage.local-dir:./uploads}") String dir,
                                     @Value("${nutrimind.app.base-url}") String baseUrl) {
        this.diretorio = Paths.get(dir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl;
        try {
            Files.createDirectories(diretorio);
        } catch (IOException e) {
            throw new UncheckedIOException("Nao foi possivel criar o diretorio de upload", e);
        }
    }

    @Override
    public UploadUrlInfo gerarUrlUpload(String contentType, long tamanhoBytes, Long userId) {
        String key = "postagens/" + userId + "/" + UUID.randomUUID() + ValidacaoImagem.extensaoPara(contentType);
        // Cria os subdiretorios se nao existirem
        try {
            Files.createDirectories(resolverSeguro(key).getParent());
        } catch (IOException e) {
            throw new UncheckedIOException("Nao foi possivel criar diretorios para upload", e);
        }
        // Retorna endpoint local que aceitara o PUT.
        // Trocando / por %2F para o PathVariable do Spring ou podemos usar request param. Usando query param.
        String uploadUrl = baseUrl + "/api/postagens/local-upload?key=" + key;
        return new UploadUrlInfo(uploadUrl, key);
    }

    @Override
    public String salvar(byte[] conteudo, String contentType) {
        String key = UUID.randomUUID() + ValidacaoImagem.extensaoPara(contentType);
        salvarNaKey(conteudo, key);
        return key;
    }

    public void salvarNaKey(byte[] conteudo, String key) {
        try {
            Files.write(resolverSeguro(key), conteudo);
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao salvar a imagem na key especificada", e);
        }
    }

    @Override
    public RecursoArmazenado carregar(String key) {
        Path caminho = resolverSeguro(key);
        if (!Files.exists(caminho)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Imagem nao encontrada");
        }
        try {
            return new RecursoArmazenado(Files.readAllBytes(caminho), ValidacaoImagem.contentTypeDaKey(key));
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao ler a imagem", e);
        }
    }

    @Override
    public void remover(String key) {
        try {
            Files.deleteIfExists(resolverSeguro(key));
        } catch (IOException e) {
            throw new UncheckedIOException("Falha ao remover a imagem", e);
        }
    }

    /** Impede path traversal: a key resolvida tem que continuar dentro do diretorio. */
    private Path resolverSeguro(String key) {
        Path caminho = diretorio.resolve(key).normalize();
        if (!caminho.startsWith(diretorio)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Key invalida");
        }
        return caminho;
    }
}
