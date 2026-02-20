package com.rodrigo.immersion_hub.api.controller;

import com.rodrigo.immersion_hub.api.dto.request.DeckRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.DeckResponseDTO;
import com.rodrigo.immersion_hub.aplication.service.DeckService;
import com.rodrigo.immersion_hub.domain.enums.Language;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/decks")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DeckController {

    private final DeckService deckService;

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public ResponseEntity<List<DeckResponseDTO>> getAll(@RequestParam(required = false) Language language) {
        if (language != null) {
            return ResponseEntity.ok(deckService.findByLanguage(language));
        }
        return ResponseEntity.ok(deckService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeckResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(deckService.findById(id));
    }

    @PostMapping
    public ResponseEntity<DeckResponseDTO> create(@Valid @RequestBody DeckRequestDTO requestDTO) {
        return ResponseEntity.ok(deckService.create(requestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeckResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody DeckRequestDTO requestDTO) {
        return ResponseEntity.ok(deckService.update(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        deckService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
