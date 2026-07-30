package com.example.kurullo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "moderator_invites")
@Data
public class ModeratorInvite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false)
    private Long userId;

    private Long invitedByAdminId;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private boolean acknowledged = false;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime expiresAt;
    private LocalDateTime confirmedAt;

    public enum Status { PENDING, CONFIRMED, EXPIRED }
}