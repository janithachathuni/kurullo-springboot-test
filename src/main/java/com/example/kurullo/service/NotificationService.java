package com.example.kurullo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.kurullo.model.Notification;
import com.example.kurullo.model.NotificationType;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.NotificationRepository;
import com.example.kurullo.repository.ProfileRepository;
import com.example.kurullo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    // Called by other services (FollowService, LikeService, etc.) — not exposed directly as an endpoint
    public void create(Long recipientId, Long actorId, NotificationType type,
                        String referenceType, Long referenceId, String message) {
        // don't notify someone about their own action (e.g. liking your own post, if that's ever allowed)
        if (actorId != null && actorId.equals(recipientId)) return;

        Notification n = new Notification();
        n.setRecipientId(recipientId);
        n.setActorId(actorId);
        n.setType(type);
        n.setReferenceType(referenceType);
        n.setReferenceId(referenceId);
        n.setMessage(message);
        notificationRepository.save(n);
    }

    public List<Map<String, Object>> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByRecipientIdAndReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(String email, Long notificationId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!n.getRecipientId().equals(user.getId())) {
            throw new RuntimeException("Not your notification");
        }

        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Notification> unread = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId())
                .stream().filter(n -> !n.isRead()).collect(Collectors.toList());

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private Map<String, Object> toMap(Notification n) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", n.getId());
        m.put("type", n.getType());
        m.put("referenceType", n.getReferenceType());
        m.put("referenceId", n.getReferenceId());
        m.put("message", n.getMessage());
        m.put("read", n.isRead());
        m.put("createdAt", n.getCreatedAt());

        if (n.getActorId() != null) {
            userRepository.findById(n.getActorId()).ifPresentOrElse(actor -> {
                m.put("actorUsername", actor.getUsername());
                profileRepository.findByUserId(actor.getId()).ifPresentOrElse(profile -> {
                    m.put("actorDisplayName", profile.getDisplayName());
                    m.put("actorProfilePic", profile.getProfilePic());
                }, () -> {
                    m.put("actorDisplayName", actor.getUsername());
                    m.put("actorProfilePic", null);
                });
            }, () -> {
                m.put("actorUsername", null);
                m.put("actorDisplayName", null);
                m.put("actorProfilePic", null);
            });
        } else {
            m.put("actorUsername", null);
            m.put("actorDisplayName", null);
            m.put("actorProfilePic", null);
        }

        return m;
    }
}