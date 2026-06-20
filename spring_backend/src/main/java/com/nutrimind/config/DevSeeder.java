package com.nutrimind.config;

import com.nutrimind.entity.Papel;
import com.nutrimind.entity.Usuario;
import com.nutrimind.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DevSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DevSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Criar nutricionista de teste se nao existir
        String emailNutri = "nutri@teste.com";
        Usuario nutri;
        if (usuarioRepository.findByEmail(emailNutri).isEmpty()) {
            nutri = new Usuario();
            nutri.setNome("Nutricionista Teste");
            nutri.setEmail(emailNutri);
            nutri.setSenhaHash(passwordEncoder.encode("senha123"));
            nutri.setPapel(Papel.NUTRICIONISTA);
            nutri.setAtivo(true);
            usuarioRepository.save(nutri);
            System.out.println("=== Nutricionista de teste criado: nutri@teste.com / senha123 ===");
        } else {
            nutri = usuarioRepository.findByEmail(emailNutri).get();
            nutri.setSenhaHash(passwordEncoder.encode("senha123"));
            usuarioRepository.save(nutri);
        }

        // Criar paciente de teste vinculado ao nutri
        String emailPaciente = "paciente@teste.com";
        if (usuarioRepository.findByEmail(emailPaciente).isEmpty()) {
            Usuario paciente = new Usuario();
            paciente.setNome("Paciente Teste");
            paciente.setEmail(emailPaciente);
            paciente.setSenhaHash(passwordEncoder.encode("senha123"));
            paciente.setPapel(Papel.PACIENTE);
            paciente.setNutricionista(nutri);
            paciente.setAtivo(true);
            usuarioRepository.save(paciente);
            System.out.println("=== Paciente de teste criado e vinculado: paciente@teste.com / senha123 ===");
        } else {
            // Garante o vinculo e atualiza a senha
            Usuario paciente = usuarioRepository.findByEmail(emailPaciente).get();
            paciente.setSenhaHash(passwordEncoder.encode("senha123"));
            if (paciente.getNutricionista() == null) {
                paciente.setNutricionista(nutri);
            }
            usuarioRepository.save(paciente);
        }
    }
}
