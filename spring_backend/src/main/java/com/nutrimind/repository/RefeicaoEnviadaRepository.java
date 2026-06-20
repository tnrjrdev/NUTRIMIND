package com.nutrimind.repository;

import com.nutrimind.entity.RefeicaoEnviada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RefeicaoEnviadaRepository extends JpaRepository<RefeicaoEnviada, Long> {

    /** Postagens de um paciente especifico (feed do proprio paciente). */
    @Query("SELECT r FROM RefeicaoEnviada r WHERE r.usuario.id = :pacienteId ORDER BY r.createdAt DESC")
    List<RefeicaoEnviada> feedDoPaciente(@Param("pacienteId") Long pacienteId);

    /** Postagens de todos os pacientes vinculados a um nutricionista. */
    @Query("SELECT r FROM RefeicaoEnviada r WHERE r.usuario.nutricionista.id = :nutricionistaId ORDER BY r.createdAt DESC")
    List<RefeicaoEnviada> feedDoNutricionista(@Param("nutricionistaId") Long nutricionistaId);
}
