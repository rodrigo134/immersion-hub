package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.api.dto.request.ForgotPasswordRequestDTO;
import com.rodrigo.immersion_hub.api.dto.request.LoginRequestDTO;
import com.rodrigo.immersion_hub.api.dto.request.ResetPasswordRequestDTO;
import com.rodrigo.immersion_hub.api.dto.request.RegisterRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.AuthResponseDTO;
import com.rodrigo.immersion_hub.domain.model.User;
import com.rodrigo.immersion_hub.domain.model.PasswordResetToken;
import com.rodrigo.immersion_hub.domain.repository.PasswordResetTokenRepository;
import com.rodrigo.immersion_hub.domain.repository.UserRepository;
import com.rodrigo.immersion_hub.infrastructure.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordResetMailService passwordResetMailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    private static final long RESET_TOKEN_EXPIRATION_MINUTES = 30;

    public AuthResponseDTO login(LoginRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        String token = jwtUtil.generateToken(request.getUsername());
        
        return new AuthResponseDTO(token, "Bearer", request.getUsername());
    }

    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setId(java.util.UUID.randomUUID());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());
        
        return new AuthResponseDTO(token, "Bearer", user.getUsername());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequestDTO request) {
        var optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return;
        }

        User user = optionalUser.get();

        var activeTokens = passwordResetTokenRepository.findByUserAndUsedAtIsNull(user);
        for (PasswordResetToken activeToken : activeTokens) {
            if (activeToken.getExpiresAt().isAfter(LocalDateTime.now())) {
                activeToken.setUsedAt(LocalDateTime.now());
            }
        }
        passwordResetTokenRepository.saveAll(activeTokens);

        String resetToken = UUID.randomUUID().toString();
        PasswordResetToken token = new PasswordResetToken();
        token.setId(UUID.randomUUID());
        token.setUser(user);
        token.setToken(resetToken);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRATION_MINUTES));
        token.setUsedAt(null);
        passwordResetTokenRepository.save(token);

        String resetLink = frontendBaseUrl + "/?mode=reset&token="
            + URLEncoder.encode(resetToken, StandardCharsets.UTF_8);

        passwordResetMailService.sendPasswordResetEmail(
            user.getEmail(),
            user.getUsername(),
            resetLink,
            RESET_TOKEN_EXPIRATION_MINUTES
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDTO request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
            .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (token.getUsedAt() != null || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired reset token");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(token);
    }
}
