package com.example.kurullo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.Follow;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
    long countByFollowingId(Long followingId);
    long countByFollowerId(Long followerId);
}