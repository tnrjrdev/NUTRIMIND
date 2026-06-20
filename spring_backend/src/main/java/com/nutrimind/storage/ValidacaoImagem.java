package com.nutrimind.storage;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/**
 * Valida imagens enviadas: tipo permitido, tamanho e assinatura de bytes (magic number).
 * A checagem de magic bytes evita que um arquivo malicioso se passe por imagem apenas
 * trocando o Content-Type / a extensao.
 */
public final class ValidacaoImagem {

    public static final long TAMANHO_MAX_BYTES = 8L * 1024 * 1024; // 8 MB

    private static final Map<String, String> CONTENT_TYPE_PARA_EXT = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp");

    private static final Map<String, String> EXT_PARA_CONTENT_TYPE = Map.of(
            "jpg", "image/jpeg",
            "jpeg", "image/jpeg",
            "png", "image/png",
            "webp", "image/webp");

    private ValidacaoImagem() {
    }

    public static void validar(byte[] conteudo, String contentType) {
        if (conteudo == null || conteudo.length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Arquivo vazio");
        }
        if (conteudo.length > TAMANHO_MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Imagem acima de 8MB");
        }
        if (contentType == null || !CONTENT_TYPE_PARA_EXT.containsKey(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Formato nao permitido (use JPEG, PNG ou WEBP)");
        }
        if (!magicBytesConferem(conteudo, contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Conteudo do arquivo nao corresponde a uma imagem valida");
        }
    }

    public static String extensaoPara(String contentType) {
        return CONTENT_TYPE_PARA_EXT.getOrDefault(contentType, ".bin");
    }

    public static String contentTypeDaKey(String key) {
        int ponto = key.lastIndexOf('.');
        String ext = ponto >= 0 ? key.substring(ponto + 1).toLowerCase() : "";
        return EXT_PARA_CONTENT_TYPE.getOrDefault(ext, "application/octet-stream");
    }

    private static boolean magicBytesConferem(byte[] b, String contentType) {
        return switch (contentType) {
            case "image/jpeg" -> b.length >= 3
                    && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF;
            case "image/png" -> b.length >= 8
                    && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G'
                    && (b[4] & 0xFF) == 0x0D && (b[5] & 0xFF) == 0x0A && (b[6] & 0xFF) == 0x1A && (b[7] & 0xFF) == 0x0A;
            case "image/webp" -> b.length >= 12
                    && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                    && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
            default -> false;
        };
    }
}
