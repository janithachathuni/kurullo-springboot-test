package com.example.kurullo.controller;

import com.example.kurullo.dto.ModeratorDtos.*;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.UserRepository;
import com.example.kurullo.service.ModeratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/moderators")
@RequiredArgsConstructor
public class ModeratorController {

    private final ModeratorService moderatorService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ModeratorView>> getModerators() {
        return ResponseEntity.ok(moderatorService.getModerators());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> removeModerator(@PathVariable Long userId) {
        moderatorService.removeModerator(userId);
        return ResponseEntity.ok(Map.of("message", "Moderator removed"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchResult>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(moderatorService.searchAppointable(query));
    }

    @PostMapping("/invite")
    public ResponseEntity<Map<String, String>> invite(@RequestBody InviteRequest request,
                                                        Authentication authentication) {
        String adminEmail = authentication.getName();
        Long adminId = userRepository.findByEmail(adminEmail)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        moderatorService.inviteModerator(request.getUserId(), adminId);
        return ResponseEntity.ok(Map.of("message", "Invite sent"));
    }

    @GetMapping("/pending-confirmations")
    public ResponseEntity<List<ConfirmedNotice>> getPendingConfirmations() {
        return ResponseEntity.ok(moderatorService.getUnacknowledgedConfirmations());
    }

    @PostMapping("/pending-confirmations/{inviteId}/acknowledge")
    public ResponseEntity<Void> acknowledge(@PathVariable Long inviteId) {
        moderatorService.acknowledgeInvite(inviteId);
        return ResponseEntity.ok().build();
    }
}