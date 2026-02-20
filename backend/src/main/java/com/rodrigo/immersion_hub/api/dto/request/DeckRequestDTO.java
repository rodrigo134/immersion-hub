package com.rodrigo.immersion_hub.api.dto.request;

import com.rodrigo.immersion_hub.domain.enums.Language;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DeckRequestDTO(
    @NotBlank(message = "Name is required")
    String name,
    
    String description,
    
    @NotNull(message = "Language is required")
    Language language
) {}
