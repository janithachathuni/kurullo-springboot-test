package com.example.kurullo.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "actor_id")
    private Long actorId; // nullable — null for system notifications (onboarding, article, warnings)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(name = "reference_type")
    private String referenceType; // e.g. "POST", "TRIP", "REPORT", "COMMENT", "SPECIES"

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(length = 500)
    private String message;

    @Column(nullable = false)
    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}