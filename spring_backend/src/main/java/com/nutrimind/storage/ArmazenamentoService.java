package com.nutrimind.storage;

/**
 * Abstracao de armazenamento de arquivos. A aplicacao nunca sabe se a imagem
 * esta no disco local (dev) ou em um bucket S3 (prod) — basta trocar a implementacao.
 *
 * Em producao, uma S3ArmazenamentoService implementaria os mesmos metodos usando o
 * AWS SDK (putObject em bucket privado com SSE-KMS; carregar/remover por key).
 */
public interface ArmazenamentoService {

    /** Persiste o conteudo e devolve a chave (key) usada para recupera-lo depois. */
    String salvar(byte[] conteudo, String contentType);

    /** Recupera o conteudo pela key. Lanca erro 404 se nao existir. */
    RecursoArmazenado carregar(String key);

    /** Remove o objeto (usado na exclusao de postagem — LGPD). */
    void remover(String key);

    /** Gera uma URL pré-assinada para upload (PUT) pelo cliente, retornando a URL e a chave gerada. */
    UploadUrlInfo gerarUrlUpload(String contentType, long tamanhoBytes, Long userId);

    record RecursoArmazenado(byte[] conteudo, String contentType) {
    }

    record UploadUrlInfo(String uploadUrl, String imagemKey) {
    }
}
