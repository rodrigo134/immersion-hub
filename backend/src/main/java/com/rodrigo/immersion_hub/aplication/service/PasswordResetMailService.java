package com.rodrigo.immersion_hub.aplication.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetMailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@immersionhub.com}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendPasswordResetEmail(
        String toEmail,
        String username,
        String resetLink,
        long expiresInMinutes
    ) {
        if (mailUsername == null || mailUsername.isBlank()) {
            throw new IllegalStateException("SMTP is not configured: MAIL_USERNAME is empty");
        }

        String sender = fromAddress;
        if (sender == null || sender.isBlank() || sender.contains("@immersionhub.com")) {
            sender = mailUsername;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(sender);
        message.setTo(toEmail);
        message.setSubject("Immersion Hub - Password Reset");
        message.setText(buildBody(username, resetLink, expiresInMinutes));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new IllegalStateException(
                "Unable to send password reset email. Check SMTP settings and Gmail app password. Root cause: "
                    + ex.getMessage()
            );
        }
    }

    private String buildBody(String username, String resetLink, long expiresInMinutes) {
        return "Hello " + username + ",\n\n"
            + "We received a request to reset your Immersion Hub password.\n\n"
            + "Use the link below to set a new password:\n"
            + resetLink + "\n\n"
            + "This link expires in " + expiresInMinutes + " minutes.\n"
            + "If you did not request this, you can safely ignore this email.\n\n"
            + "Immersion Hub Team";
    }
}
