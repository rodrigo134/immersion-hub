package com.rodrigo.immersion_hub.api.controller;


import com.rodrigo.immersion_hub.api.dto.request.SourceRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.SourceResponseDTO;
import com.rodrigo.immersion_hub.aplication.service.SourceService;
import com.rodrigo.immersion_hub.domain.enums.Language;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/sources")
public class SourceController {

    public final SourceService sourceService;

    public SourceController(SourceService sourceService) {
        this.sourceService = sourceService;
    }

    @GetMapping
    public ResponseEntity<List<SourceResponseDTO>>  getAll(@RequestParam(required = false) Language language) {
        if (language != null) {
            return ResponseEntity.ok(sourceService.findByLanguage(language));
        }


        return ResponseEntity.ok(sourceService.findAll());
    }
    @PostMapping
    public ResponseEntity<SourceResponseDTO> create(@RequestBody SourceRequestDTO requestDTO){
        return ResponseEntity.ok(sourceService.create(requestDTO));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        sourceService.deleteById(id);
    }




}