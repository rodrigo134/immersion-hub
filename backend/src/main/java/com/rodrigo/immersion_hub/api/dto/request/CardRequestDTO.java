package com.rodrigo.immersion_hub.api.dto.request;

import com.rodrigo.immersion_hub.domain.enums.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CardRequestDTO(
    @NotNull(message = "Deck ID is required")
    UUID deckId,
    
    @NotNull(message = "Language is required")
    Language language,
    
    @NotBlank(message = "Front content is required")
    String front,
    
    @NotBlank(message = "Back content is required")
    String back,
    
    String context,
    
    Integer difficulty
) {}
