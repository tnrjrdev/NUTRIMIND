package com.nutrimind.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

/**
 * Assina/valida URLs temporarias de acesso a imagem (HMAC-SHA256 sobre key + expiracao).
 * Equivalente local ao "presigned GET" do S3: a propria URL e a credencial, com validade curta.
 * Reaproveita o segredo do JWT.
 */
@Component
public class UrlAssinada {

    private final byte[] segredo;

    public UrlAssinada(@Value("${nutrimind.jwt.secret}") String secret) {
        this.segredo = secret.getBytes(StandardCharsets.UTF_8);
    }

    /** Retorna a querystring "exp=...&sig=..." para anexar a URL da imagem. */
    public String assinarQuery(String objectKey, Duration validade) {
        long exp = Instant.now().plus(validade).getEpochSecond();
        return "exp=" + exp + "&sig=" + hmac(objectKey + ":" + exp);
    }

    public void verificar(String objectKey, long exp, String sig) {
        if (Instant.now().getEpochSecond() > exp) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "URL expirada");
        }
        String esperado = hmac(objectKey + ":" + exp);
        boolean ok = MessageDigest.isEqual(
                esperado.getBytes(StandardCharsets.UTF_8),
                sig.getBytes(StandardCharsets.UTF_8));
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Assinatura invalida");
        }
    }

    private String hmac(String dados) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(segredo, "HmacSHA256"));
            byte[] raw = mac.doFinal(dados.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        } catch (Exception e) {
            throw new IllegalStateException("Falha ao assinar URL", e);
        }
    }
}
