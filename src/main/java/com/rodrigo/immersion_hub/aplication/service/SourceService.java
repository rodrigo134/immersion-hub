package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.api.dto.request.SourceRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.SourceResponseDTO;
import com.rodrigo.immersion_hub.domain.enums.Language;
import com.rodrigo.immersion_hub.domain.model.Source;
import com.rodrigo.immersion_hub.domain.exception.NotFoundException;
import com.rodrigo.immersion_hub.domain.repository.SourceRepository;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class SourceService {

    private final SourceRepository sourceRepository;

    public SourceService(SourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }


    public List<SourceResponseDTO>findAll() {
        return sourceRepository.findAll()
                .stream()
                .map(SourceResponseDTO::fromEntity)
                .toList();
    }
    public SourceResponseDTO create(SourceRequestDTO requestDTO){
        Source source = new Source();
        source.setId(UUID.randomUUID());
        source.setName(requestDTO.name());
        source.setUrl(requestDTO.url());
        source.setCategory(requestDTO.category());
        source.setLanguage(requestDTO.language());
        
        Source savedSource = sourceRepository.save(source);
        return SourceResponseDTO.fromEntity(savedSource);
    }


    public void deleteById(UUID id){
        sourceRepository.deleteById(id);
    }

    public List<SourceResponseDTO> findByLanguage(Language language) {
        List<Source> sources = sourceRepository.findByLanguage(language);

        
        return sources.stream()
                .map(SourceResponseDTO::fromEntity)
                .toList();
    }


}
