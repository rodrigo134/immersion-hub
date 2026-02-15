package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.domain.model.Source;
import com.rodrigo.immersion_hub.domain.repository.SourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SourceService {

    private SourceRepository sourceRepository;

    public SourceService(SourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }


    public List<Source> findAll() {
        return sourceRepository.findAll();
    }
    public Source create(Source source){
        source.setId(UUID.randomUUID());
        return sourceRepository.save(source);
    }


    public void deleteById(UUID id){
        sourceRepository.deleteById(id);
    }



}
