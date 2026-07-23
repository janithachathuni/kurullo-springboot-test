package com.example.kurullo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.example.kurullo.model.ChecklistNote;

public interface ChecklistNoteRepository extends JpaRepository<ChecklistNote, Long> {
    List<ChecklistNote> findByChecklistIdOrderByCreatedAtDesc(Long checklistId);
    Optional<ChecklistNote> findByIdAndChecklistId(Long id, Long checklistId);

    @Transactional
    void deleteByIdAndChecklistId(Long id, Long checklistId);
}