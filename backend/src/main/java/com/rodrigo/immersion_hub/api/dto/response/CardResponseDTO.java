package com.rodrigo.immersion_hub.api.dto.response;

import com.rodrigo.immersion_hub.domain.enums.Language;
import java.time.LocalDateTime;
import java.util.UUID;

public record CardResponseDTO(
    UUID id,
    UUID deckId,
    Language language,
    String front,
    String back,
    String context,
    Integer difficulty,
    Integer interval,
    Integer repetitions,
    LocalDateTime nextReview,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
