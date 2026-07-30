package com.example.kurullo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);

    List<User> findByModeratorTrue();

    List<User> findByUsernameContainingIgnoreCaseAndModeratorFalseAndRole(
            String query, User.Role role);
}