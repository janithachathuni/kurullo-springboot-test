package com.example.kurullo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.Block;

public interface BlockRepository extends JpaRepository<Block, Long> {
    boolean existsByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
    void deleteByBlockerIdAndBlockedId(Long blockerId, Long blockedId);
}