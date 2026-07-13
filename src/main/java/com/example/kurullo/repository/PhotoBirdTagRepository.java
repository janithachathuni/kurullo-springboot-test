package com.example.kurullo.repository;

import com.example.kurullo.model.PhotoBirdTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhotoBirdTagRepository extends JpaRepository<PhotoBirdTag, Long> {
    List<PhotoBirdTag> findByBirdId(Long birdId);
}