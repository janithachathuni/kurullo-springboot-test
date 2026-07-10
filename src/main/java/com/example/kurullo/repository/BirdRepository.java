package com.example.kurullo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.Bird;

public interface BirdRepository extends JpaRepository<Bird, Long> {
    boolean existsByScientificNameIgnoreCase(String scientificName);
}