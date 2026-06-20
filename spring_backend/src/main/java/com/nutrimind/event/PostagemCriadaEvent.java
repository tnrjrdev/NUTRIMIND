package com.nutrimind.event;

import com.nutrimind.entity.PostagemAlimentar;
import com.nutrimind.entity.Usuario;

public record PostagemCriadaEvent(PostagemAlimentar postagem, Usuario paciente) {
}
