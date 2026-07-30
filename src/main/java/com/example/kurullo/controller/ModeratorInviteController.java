package com.example.kurullo.controller;

import com.example.kurullo.service.ModeratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/moderator-invite")
@RequiredArgsConstructor
public class ModeratorInviteController {

    private final ModeratorService moderatorService;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam String token) {
        try {
            String username = moderatorService.confirmInvite(token);
            return ResponseEntity.ok(Map.of("message", "Confirmed", "username", username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}