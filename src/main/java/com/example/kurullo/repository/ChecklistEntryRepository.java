package com.example.kurullo.repository;

import com.example.kurullo.model.ChecklistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ChecklistEntryRepository extends JpaRepository<ChecklistEntry, Long> {
    List<ChecklistEntry> findByChecklistId(Long checklistId);
    Optional<ChecklistEntry> findByIdAndChecklistId(Long id, Long checklistId);

    @Transactional
    void deleteByIdAndChecklistId(Long id, Long checklistId);
}