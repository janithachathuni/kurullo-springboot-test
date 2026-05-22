package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String role;
    private boolean isFirstLogin;
    private boolean profileCompleted;
}