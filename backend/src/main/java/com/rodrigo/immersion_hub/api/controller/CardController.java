package com.rodrigo.immersion_hub.api.controller;

import com.rodrigo.immersion_hub.api.dto.request.CardRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.CardResponseDTO;
import com.rodrigo.immersion_hub.aplication.service.CardService;
import com.rodrigo.immersion_hub.domain.enums.Language;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/cards")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public ResponseEntity<List<CardResponseDTO>> getByDeckId(@RequestParam UUID deckId) {
        return ResponseEntity.ok(cardService.findByDeckId(deckId));
    }

    @GetMapping("/language")
    public ResponseEntity<List<CardResponseDTO>> getByLanguage(@RequestParam Language language) {
        return ResponseEntity.ok(cardService.findByLanguage(language));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<CardResponseDTO>> getByDeckIdAndLanguage(
            @RequestParam UUID deckId, 
            @RequestParam Language language) {
        return ResponseEntity.ok(cardService.findByDeckIdAndLanguage(deckId, language));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(cardService.findById(id));
    }

    @GetMapping("/deck/{deckId}/review")
    public ResponseEntity<List<CardResponseDTO>> getCardsForReview(@PathVariable UUID deckId) {
        return ResponseEntity.ok(cardService.getCardsDueForReview(deckId));
    }

    @PostMapping
    public ResponseEntity<CardResponseDTO> create(@Valid @RequestBody CardRequestDTO requestDTO) {
        return ResponseEntity.ok(cardService.create(requestDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody CardRequestDTO requestDTO) {
        return ResponseEntity.ok(cardService.update(id, requestDTO));
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<CardResponseDTO> updateReviewProgress(
            @PathVariable UUID id,
            @RequestParam int quality
    ) {
        return ResponseEntity.ok(cardService.updateReviewProgress(id, quality));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        cardService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
