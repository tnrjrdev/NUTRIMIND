package com.nutrimind.repository;

import com.nutrimind.entity.Comentario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    
    @Query("SELECT c FROM Comentario c JOIN FETCH c.autor WHERE c.postagem.id = :postagemId ORDER BY c.createdAt ASC")
    Page<Comentario> findByPostagemId(@Param("postagemId") Long postagemId, Pageable pageable);
}
