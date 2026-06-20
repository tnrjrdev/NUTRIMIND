package com.nutrimind.event;

import com.nutrimind.entity.PostagemAlimentar;
import com.nutrimind.entity.Usuario;

public record InteracaoCriadaEvent(PostagemAlimentar postagem, Usuario autor, String tipoInteracao) {
}
