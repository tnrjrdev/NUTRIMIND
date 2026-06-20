package com.nutrimind.repository;

import com.nutrimind.entity.PostagemAlimentar;
import com.nutrimind.entity.TipoRefeicao;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class PostagemAlimentarSpecs {

    public static Specification<PostagemAlimentar> doPaciente(Long pacienteId) {
        return (root, query, cb) -> cb.equal(root.get("paciente").get("id"), pacienteId);
    }

    public static Specification<PostagemAlimentar> dosPacientesDe(Long nutriId) {
        return (root, query, cb) -> {
            Join<Object, Object> paciente = root.join("paciente", JoinType.INNER);
            Join<Object, Object> nutri = paciente.join("nutricionista", JoinType.INNER);
            return cb.equal(nutri.get("id"), nutriId);
        };
    }

    public static Specification<PostagemAlimentar> filtros(Long pacienteId, TipoRefeicao tipo, LocalDateTime de, LocalDateTime ate) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();
            if (pacienteId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("paciente").get("id"), pacienteId));
            }
            if (tipo != null) {
                predicates = cb.and(predicates, cb.equal(root.get("tipoRefeicao"), tipo));
            }
            if (de != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("capturadaEm"), de));
            }
            if (ate != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("capturadaEm"), ate));
            }
            return predicates;
        };
    }
}
