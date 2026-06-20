package com.nutrimind.repository;

import com.nutrimind.entity.PostagemAlimentar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PostagemAlimentarRepository extends JpaRepository<PostagemAlimentar, Long>, JpaSpecificationExecutor<PostagemAlimentar> {

    @Query("SELECT p FROM PostagemAlimentar p WHERE p.paciente.id = :pacienteId ORDER BY p.createdAt DESC")
    List<PostagemAlimentar> feedDoPaciente(@Param("pacienteId") Long pacienteId);

    @Query("SELECT p FROM PostagemAlimentar p WHERE p.paciente.nutricionista.id = :nutriId ORDER BY p.createdAt DESC")
    List<PostagemAlimentar> feedDoNutricionista(@Param("nutriId") Long nutriId);
}
