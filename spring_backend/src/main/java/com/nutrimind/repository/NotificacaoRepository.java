package com.nutrimind.repository;

import com.nutrimind.entity.Notificacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {
    
    Page<Notificacao> findByUsuarioIdOrderByCreatedAtDesc(Long usuarioId, Pageable pageable);
    
    @Query("SELECT count(n) FROM Notificacao n WHERE n.usuario.id = :usuarioId AND n.lida = false")
    long countNaoLidas(@Param("usuarioId") Long usuarioId);

    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true WHERE n.usuario.id = :usuarioId AND n.lida = false")
    void marcarTodasComoLidas(@Param("usuarioId") Long usuarioId);
}
