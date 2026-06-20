package com.nutrimind.web;

import com.fasterxml.jackson.databind.JsonNode;
import com.nutrimind.entity.Papel;
import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.UsuarioRepository;
import com.nutrimind.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UsuarioController(UsuarioRepository repository,
                             PasswordEncoder passwordEncoder,
                             JwtService jwtService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<Usuario> list() {
        return repository.findAll();
    }

    @GetMapping("/nutricionistas")
    public List<Map<String, Object>> listarNutricionistas() {
        return repository.findByPapel(Papel.NUTRICIONISTA).stream()
                .filter(u -> Boolean.TRUE.equals(u.getAtivo()))
                .map(u -> Map.of("id", (Object) u.getId(), "nome", (Object) u.getNome()))
                .toList();
    }

    @GetMapping("/{id}")
    public Usuario get(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody JsonNode body) {
        String nome = text(body, "nome");
        String email = text(body, "email");
        String senha = text(body, "senha");

        if (isBlank(nome) || isBlank(email) || isBlank(senha)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Nome, email e senha sao obrigatorios."));
        }
        if (repository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Ja existe um usuario com este email."));
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setAtivo(body.has("ativo") ? body.get("ativo").asBoolean(true) : true);
        aplicarPapelEVinculo(usuario, body);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody JsonNode body) {
        return doUpdate(id, body);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> patch(@PathVariable Long id, @RequestBody JsonNode body) {
        return doUpdate(id, body);
    }

    private ResponseEntity<?> doUpdate(Long id, JsonNode body) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (body.has("nome")) {
            usuario.setNome(text(body, "nome"));
        }
        if (body.has("email")) {
            usuario.setEmail(text(body, "email"));
        }
        if (body.has("ativo")) {
            usuario.setAtivo(body.get("ativo").asBoolean(true));
        }
        // Senha so e alterada quando enviada e nao vazia (edicao opcional no admin).
        String senha = text(body, "senha");
        if (!isBlank(senha)) {
            usuario.setSenhaHash(passwordEncoder.encode(senha));
        }
        aplicarPapelEVinculo(usuario, body);
        return ResponseEntity.ok(repository.save(usuario));
    }

    /**
     * Define papel (PACIENTE/NUTRICIONISTA/ADMIN) e o nutricionista vinculado, quando enviados.
     * Apenas ADMIN pode alterar esses campos (evita escalonamento de privilegio).
     */
    private void aplicarPapelEVinculo(Usuario usuario, JsonNode body) {
        boolean alteraPapel = body.hasNonNull("papel");
        boolean alteraVinculo = body.has("nutricionistaId");
        if (!alteraPapel && !alteraVinculo) {
            return;
        }
        if (usuarioLogado().getPapelEfetivo() != Papel.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Apenas administradores podem definir papel ou vinculo.");
        }
        if (body.hasNonNull("papel")) {
            try {
                usuario.setPapel(Papel.valueOf(body.get("papel").asText()));
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "papel invalido: " + body.get("papel").asText());
            }
        }
        if (body.has("nutricionistaId")) {
            JsonNode node = body.get("nutricionistaId");
            if (node.isNull()) {
                usuario.setNutricionista(null);
            } else {
                Usuario nutri = repository.findById(node.asLong())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "nutricionista inexistente"));
                usuario.setNutricionista(nutri);
            }
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @RequestParam(name = "hard", defaultValue = "false") boolean hard) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (hard) {
            // "Excluir": remocao fisica do usuario.
            repository.delete(usuario);
        } else {
            // "Inativar": soft delete (ativo=false), preservando o registro.
            usuario.setAtivo(false);
            repository.save(usuario);
        }
        return ResponseEntity.noContent().build();
    }

    /** Cadastro publico (espelha POST /api/usuarios/registro do Django). */
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody JsonNode body) {
        String nome = text(body, "nome");
        String email = text(body, "email");
        String senha = text(body, "senha");

        if (isBlank(nome) || isBlank(email) || isBlank(senha)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Nome, email e senha sao obrigatorios."));
        }
        if (repository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Ja existe um usuario com este email."));
        }

        Usuario usuario = new Usuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setSenhaHash(passwordEncoder.encode(senha));
        usuario.setAtivo(true);
        usuario.setPapel(Papel.PACIENTE);
        usuario = repository.save(usuario);

        String token = jwtService.generateToken(usuario.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "auth", true,
                "token", token,
                "user", usuario));
    }

    private Usuario usuarioLogado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Long userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao autenticado");
        }
        return repository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario nao encontrado"));
    }

    private static String text(JsonNode node, String key) {
        JsonNode value = node.get(key);
        return value == null || value.isNull() ? null : value.asText();
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
