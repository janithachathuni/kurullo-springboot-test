package com.example.kurullo.service;

import com.example.kurullo.dto.ModeratorDtos.*;
import com.example.kurullo.model.ModeratorInvite;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.ModeratorInviteRepository;
import com.example.kurullo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModeratorService {

    private final UserRepository userRepository;
    private final ModeratorInviteRepository inviteRepository;
    private final EmailService emailService;

    public List<ModeratorView> getModerators() {
        return userRepository.findByModeratorTrue().stream()
                .map(u -> new ModeratorView(u.getId(), u.getUsername(), null))
                .collect(Collectors.toList());
    }

    public void removeModerator(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setModerator(false);
        userRepository.save(user);
    }

    public List<UserSearchResult> searchAppointable(String query) {
        return userRepository
                .findByUsernameContainingIgnoreCaseAndModeratorFalseAndRole(query, User.Role.BIRDER)
                .stream()
                .map(u -> new UserSearchResult(u.getId(), u.getUsername(), null))
                .collect(Collectors.toList());
    }

    public void inviteModerator(Long userId, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        inviteRepository.findByUserIdAndStatus(userId, ModeratorInvite.Status.PENDING)
                .ifPresent(existing -> { existing.setStatus(ModeratorInvite.Status.EXPIRED); inviteRepository.save(existing); });

        ModeratorInvite invite = new ModeratorInvite();
        invite.setToken(UUID.randomUUID().toString());
        invite.setUserId(user.getId());
        invite.setInvitedByAdminId(adminId);
        invite.setExpiresAt(LocalDateTime.now().plusDays(3));
        inviteRepository.save(invite);

        emailService.sendModeratorInviteEmail(user.getEmail(), user.getUsername(), invite.getToken());
    }

    public String confirmInvite(String token) {
        ModeratorInvite invite = inviteRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired invite"));

        if (invite.getStatus() != ModeratorInvite.Status.PENDING) {
            throw new RuntimeException("This invite has already been used or expired");
        }
        if (invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            invite.setStatus(ModeratorInvite.Status.EXPIRED);
            inviteRepository.save(invite);
            throw new RuntimeException("This invite has expired");
        }

        User user = userRepository.findById(invite.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setModerator(true);
        userRepository.save(user);

        invite.setStatus(ModeratorInvite.Status.CONFIRMED);
        invite.setConfirmedAt(LocalDateTime.now());
        inviteRepository.save(invite);

        return user.getUsername();
    }

    public List<ConfirmedNotice> getUnacknowledgedConfirmations() {
        return inviteRepository.findByStatusAndAcknowledgedFalse(ModeratorInvite.Status.CONFIRMED)
                .stream()
                .map(inv -> {
                    User user = userRepository.findById(inv.getUserId()).orElse(null);
                    return new ConfirmedNotice(inv.getId(), user != null ? user.getUsername() : "Unknown");
                })
                .collect(Collectors.toList());
    }

    public void acknowledgeInvite(Long inviteId) {
        ModeratorInvite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));
        invite.setAcknowledged(true);
        inviteRepository.save(invite);
    }
}