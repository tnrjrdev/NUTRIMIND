package com.nutrimind.web.controller;

import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.UsuarioRepository;
import com.nutrimind.web.dto.PacienteResumoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/nutricionistas")
public class NutricionistaController {

    private final UsuarioRepository usuarioRepository;

    public NutricionistaController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/me/pacientes")
    public ResponseEntity<List<PacienteResumoDTO>> getMeusPacientes(Authentication authentication) {
        String email = authentication.getName();
        Usuario nutricionista = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nutricionista não encontrado"));

        List<Usuario> pacientes = usuarioRepository.findByNutricionista_Id(nutricionista.getId());
        
        List<PacienteResumoDTO> pacientesDTO = pacientes.stream()
                .map(PacienteResumoDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(pacientesDTO);
    }
}
