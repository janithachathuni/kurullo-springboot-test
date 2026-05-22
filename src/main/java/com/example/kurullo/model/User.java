package com.example.kurullo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.BIRDER;

    private boolean moderator = false;
    private boolean isFirstLogin = true;
    private boolean profileCompleted = false;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private String googleId;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role { ADMIN, BIRDER }
    public enum Status { ACTIVE, SUSPENDED, DELETED }
}