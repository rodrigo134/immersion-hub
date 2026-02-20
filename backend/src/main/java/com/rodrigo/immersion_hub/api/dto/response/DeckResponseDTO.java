package com.rodrigo.immersion_hub.api.dto.response;

import com.rodrigo.immersion_hub.domain.enums.Language;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DeckResponseDTO(
    UUID id,
    String name,
    String description,
    Language language,
    Integer cardCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
