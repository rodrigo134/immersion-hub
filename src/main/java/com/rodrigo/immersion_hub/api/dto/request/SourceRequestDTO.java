package com.rodrigo.immersion_hub.api.dto.request;

import com.rodrigo.immersion_hub.domain.enums.Language;
import com.rodrigo.immersion_hub.domain.enums.SourceCategory;

public record SourceRequestDTO(
         String name,
         String url,
         SourceCategory category,
         Language language

) {
}
