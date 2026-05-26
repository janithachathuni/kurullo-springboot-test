package com.example.kurullo.controller;

import com.example.kurullo.model.Profile;
import com.example.kurullo.security.JwtUtil;
import com.example.kurullo.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final JwtUtil jwtUtil;

    @PostMapping("/complete")
public ResponseEntity<?> completeProfile(
        @RequestHeader("Authorization") String authHeader,
        @RequestParam("displayName") String displayName,
        @RequestParam("bio") String bio,
        @RequestParam(value = "profilePic", required = false) MultipartFile profilePic,
        @RequestParam(value = "bannerPic",  required = false) MultipartFile bannerPic
) {
    try {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);  // use email, not userId

        Profile profile = profileService.completeProfile(email, displayName, bio, profilePic, bannerPic);

        return ResponseEntity.ok(Map.of(
                "message", "Profile completed successfully",
                "displayName", profile.getDisplayName()
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
}