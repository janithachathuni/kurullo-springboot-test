package com.example.kurullo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.kurullo.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    long countByRecipientIdAndReadFalse(Long recipientId);
}