package com.nutrimind.repository;

import com.nutrimind.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    java.util.List<com.nutrimind.entity.Usuario> findByPapel(com.nutrimind.entity.Papel papel);
}
