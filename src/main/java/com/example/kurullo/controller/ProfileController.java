package com.example.kurullo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.kurullo.model.Profile;
import com.example.kurullo.security.JwtUtil;
import com.example.kurullo.service.ProfileService;

import lombok.RequiredArgsConstructor;

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
            String email = jwtUtil.extractEmail(token);

            Profile profile = profileService.completeProfile(email, displayName, bio, profilePic, bannerPic);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile completed successfully",
                    "displayName", profile.getDisplayName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(
            @PathVariable String username,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        try {
            String viewerEmail = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.replace("Bearer ", "");
                if (jwtUtil.isValid(token)) {
                    viewerEmail = jwtUtil.extractEmail(token);
                }
            }
            return ResponseEntity.ok(profileService.getProfileByUsername(username, viewerEmail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{username}/follow")
    public ResponseEntity<?> follow(@PathVariable String username, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
            profileService.follow(email, username);
            return ResponseEntity.ok(Map.of("message", "Followed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{username}/unfollow")
    public ResponseEntity<?> unfollow(@PathVariable String username, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
            profileService.unfollow(email, username);
            return ResponseEntity.ok(Map.of("message", "Unfollowed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{username}/block")
    public ResponseEntity<?> block(@PathVariable String username, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
            profileService.block(email, username);
            return ResponseEntity.ok(Map.of("message", "Blocked"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{username}/unblock")
    public ResponseEntity<?> unblock(@PathVariable String username, @RequestHeader("Authorization") String authHeader) {
        try {
            String email = jwtUtil.extractEmail(authHeader.replace("Bearer ", ""));
            profileService.unblock(email, username);
            return ResponseEntity.ok(Map.of("message", "Unblocked"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}