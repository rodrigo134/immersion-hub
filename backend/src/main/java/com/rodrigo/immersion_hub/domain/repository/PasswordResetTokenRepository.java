package com.rodrigo.immersion_hub.domain.repository;

import com.rodrigo.immersion_hub.domain.model.PasswordResetToken;
import com.rodrigo.immersion_hub.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findByUserAndUsedAtIsNull(User user);
}
