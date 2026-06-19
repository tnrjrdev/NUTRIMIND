package com.nutrimind.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Faz o Jackson serializar/desserializar pelos campos das entidades (sem precisar
 * de getters/setters), e ignora propriedades extras enviadas pelo frontend
 * (ex.: campos write-only como "categoriaId", tratados manualmente nos controllers).
 */
@Configuration
public class JacksonConfig {

    @Bean
    Jackson2ObjectMapperBuilderCustomizer nutrimindJacksonCustomizer() {
        return builder -> {
            builder.visibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);
            builder.featuresToDisable(
                    DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                    SerializationFeature.FAIL_ON_EMPTY_BEANS);
        };
    }
}
