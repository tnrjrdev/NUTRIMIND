package com.nutrimind.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.ServerSideEncryption;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.time.Duration;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "nutrimind.storage.tipo", havingValue = "s3")
public class S3ArmazenamentoService implements ArmazenamentoService {

    private final String bucket;
    private final S3Presigner s3Presigner;

    public S3ArmazenamentoService(@Value("${nutrimind.storage.s3.bucket:nutrimind-bucket}") String bucket) {
        this.bucket = bucket;
        this.s3Presigner = S3Presigner.create();
    }

    @Override
    public UploadUrlInfo gerarUrlUpload(String contentType, long tamanhoBytes, Long userId) {
        String key = "postagens/" + userId + "/" + UUID.randomUUID() + ValidacaoImagem.extensaoPara(contentType);
        var presign = s3Presigner.presignPutObject(b -> b
                .signatureDuration(Duration.ofMinutes(2))
                .putObjectRequest(p -> p.bucket(bucket).key(key)
                        .contentType(contentType)
                        .serverSideEncryption(ServerSideEncryption.AWS_KMS)));
        return new UploadUrlInfo(presign.url().toString(), key);
    }

    @Override
    public String salvar(byte[] conteudo, String contentType) {
        throw new UnsupportedOperationException("S3 direct upload should use presigned URLs");
    }

    @Override
    public RecursoArmazenado carregar(String key) {
        throw new UnsupportedOperationException("S3 reads should use presigned GET URLs or CloudFront");
    }

    @Override
    public void remover(String key) {
        // Opcional: implementar S3Client.deleteObject()
    }
}
