package com.example.kurullo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.ModeratorInvite;

public interface ModeratorInviteRepository extends JpaRepository<ModeratorInvite, Long> {
    Optional<ModeratorInvite> findByToken(String token);
    Optional<ModeratorInvite> findByUserIdAndStatus(Long userId, ModeratorInvite.Status status);
    List<ModeratorInvite> findByStatusAndAcknowledgedFalse(ModeratorInvite.Status status);
}