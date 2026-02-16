package com.rodrigo.immersion_hub.api.dto.request;

import com.rodrigo.immersion_hub.domain.enums.Language;
import com.rodrigo.immersion_hub.domain.enums.SourceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SourceRequestDTO(
         @NotBlank @Size(min = 2, max = 40)
         String name,
         @NotBlank String url,
         @NotNull SourceCategory category,
         @NotNull Language language

) {
}
