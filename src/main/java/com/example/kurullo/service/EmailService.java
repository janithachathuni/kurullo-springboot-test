package com.example.kurullo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendModeratorInviteEmail(String toEmail, String username, String token) {
        String confirmLink = frontendUrl + "/moderator-confirm?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("You've been invited to become a moderator on Kurullo");
        message.setText(
            "Hi " + username + ",\n\n" +
            "An admin has invited you to become a moderator on Kurullo.\n" +
            "Click the link below to confirm:\n\n" +
            confirmLink + "\n\n" +
            "If you did not expect this, you can ignore this email."
        );
        mailSender.send(message);
    }
}