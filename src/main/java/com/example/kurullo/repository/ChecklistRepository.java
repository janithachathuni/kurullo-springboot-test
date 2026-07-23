package com.example.kurullo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.Checklist;

public interface ChecklistRepository extends JpaRepository<Checklist, Long> {
    List<Checklist> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Checklist> findByTripIdOrderByCreatedAtDesc(Long tripId);
}