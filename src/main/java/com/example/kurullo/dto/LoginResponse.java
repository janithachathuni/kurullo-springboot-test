package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String token;
    private String role;
    private boolean firstLogin;
    private boolean profileCompleted;
    private String username;
}