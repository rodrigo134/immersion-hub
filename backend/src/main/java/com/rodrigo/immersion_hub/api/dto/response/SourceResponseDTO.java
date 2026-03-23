package com.rodrigo.immersion_hub.api.dto.response;

import com.rodrigo.immersion_hub.domain.enums.SourceCategory;
import com.rodrigo.immersion_hub.domain.enums.Language;
import com.rodrigo.immersion_hub.domain.model.Source;

import java.util.UUID;

public record SourceResponseDTO(
        UUID id,
        String name,
        String url,
        String description,
        SourceCategory category,
        Language language,
        boolean favorite
) {

    public static SourceResponseDTO fromEntity(Source source, boolean favorite) {
        return new SourceResponseDTO(
                source.getId(),
                source.getName(),
                source.getUrl(),
                source.getDescription(),
                source.getCategory(),
                source.getLanguage(),
                favorite
        );
    }
}
