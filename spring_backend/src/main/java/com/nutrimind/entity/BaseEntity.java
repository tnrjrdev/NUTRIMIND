package com.nutrimind.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Superclasse das tabelas geradas pelo Prisma. Os timestamps sao armazenados como
 * TEXT no formato "yyyy-MM-dd HH:mm:ss.SSSSSS" (mesmo formato que o Prisma/Django gravavam),
 * por isso sao mapeados como String e preenchidos via callbacks de ciclo de vida.
 */
@MappedSuperclass
public abstract class BaseEntity {

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "createdAt", updatable = false)
    private String createdAt;

    @Column(name = "updatedAt")
    private String updatedAt;

    @PrePersist
    void onCreate() {
        String now = LocalDateTime.now().format(FMT);
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now().format(FMT);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }
}
