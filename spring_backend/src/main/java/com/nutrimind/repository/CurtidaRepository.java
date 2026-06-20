package com.nutrimind.repository;

import com.nutrimind.entity.Curtida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CurtidaRepository extends JpaRepository<Curtida, Long> {
    Optional<Curtida> findByPostagemIdAndAutorId(Long postagemId, Long autorId);
    boolean existsByPostagemIdAndAutorId(Long postagemId, Long autorId);
    long countByPostagemId(Long postagemId);
}
