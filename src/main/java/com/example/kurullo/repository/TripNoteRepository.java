package com.example.kurullo.repository;

import com.example.kurullo.model.TripNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TripNoteRepository extends JpaRepository<TripNote, Long> {
    List<TripNote> findByTripIdOrderByCreatedAtDesc(Long tripId);

    Optional<TripNote> findByIdAndTripId(Long id, Long tripId);

    @Transactional
    void deleteByIdAndTripId(Long id, Long tripId);
}