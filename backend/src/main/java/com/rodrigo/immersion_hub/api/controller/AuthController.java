package com.rodrigo.immersion_hub.api.controller;

import com.rodrigo.immersion_hub.api.dto.request.ForgotPasswordRequestDTO;
import com.rodrigo.immersion_hub.api.dto.request.LoginRequestDTO;
import com.rodrigo.immersion_hub.api.dto.request.ResetPasswordRequestDTO;
import com.rodrigo.immersion_hub.api.dto.request.RegisterRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.AuthResponseDTO;
import com.rodrigo.immersion_hub.api.dto.response.MessageResponseDTO;
import com.rodrigo.immersion_hub.aplication.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        AuthResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Register new user and return JWT token")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        AuthResponseDTO response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Create reset token", description = "Generate temporary token to reset password")
    public ResponseEntity<MessageResponseDTO> forgotPassword(
        @Valid @RequestBody ForgotPasswordRequestDTO request
    ) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(
            new MessageResponseDTO("If the email exists, password recovery instructions were sent.")
        );
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset user password using temporary token")
    public ResponseEntity<MessageResponseDTO> resetPassword(
        @Valid @RequestBody ResetPasswordRequestDTO request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponseDTO("Password updated successfully"));
    }
}
