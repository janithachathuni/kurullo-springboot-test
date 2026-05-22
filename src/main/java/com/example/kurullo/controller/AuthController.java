package com.example.kurullo.controller;

import com.example.kurullo.dto.LoginRequest;
import com.example.kurullo.dto.LoginResponse;
import com.example.kurullo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, String> body) {
        authService.register(body.get("username"), body.get("email"), body.get("password"));
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }

    @PostMapping("/complete-google-registration")
    public ResponseEntity<Map<String, String>> completeGoogleRegistration(@RequestBody Map<String, String> body) {
        authService.completeGoogleRegistration(
                body.get("username"),
                body.get("email"),
                body.get("googleId")
        );
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }
}