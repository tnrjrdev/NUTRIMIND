package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.UsuarioRepository;
import com.nutrimind.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository repository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody JsonNode body) {
        String username = text(body, "username");
        String password = text(body, "password");

        if (isBlank(username) || isBlank(password)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Usuario e senha sao obrigatorios"));
        }

        Usuario usuario = repository.findByEmail(username).orElse(null);
        boolean valid = usuario != null
                && Boolean.TRUE.equals(usuario.getAtivo())
                && passwordEncoder.matches(password, usuario.getSenhaHash());

        if (!valid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciais invalidas"));
        }

        String token = jwtService.generateToken(usuario.getId());
        return ResponseEntity.ok(Map.of(
                "auth", true,
                "token", token,
                "user", usuario));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        Usuario usuario = repository.findById(userId).orElse(null);
        if (usuario == null || !Boolean.TRUE.equals(usuario.getAtivo())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("auth", false, "message", "Usuario nao encontrado"));
        }

        return ResponseEntity.ok(Map.of("auth", true, "user", usuario));
    }

    private static String text(JsonNode node, String key) {
        JsonNode value = node.get(key);
        return value == null || value.isNull() ? null : value.asText();
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
