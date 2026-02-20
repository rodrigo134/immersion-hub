package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.api.dto.request.DeckRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.DeckResponseDTO;
import com.rodrigo.immersion_hub.domain.exception.NotFoundException;
import com.rodrigo.immersion_hub.domain.model.Deck;
import com.rodrigo.immersion_hub.domain.repository.DeckRepository;
import com.rodrigo.immersion_hub.domain.enums.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DeckService {

    private final DeckRepository deckRepository;

    public DeckResponseDTO create(DeckRequestDTO requestDTO) {
        Deck deck = new Deck();
        deck.setId(UUID.randomUUID());
        deck.setName(requestDTO.name());
        deck.setDescription(requestDTO.description());
        deck.setLanguage(requestDTO.language());

        Deck savedDeck = deckRepository.save(deck);
        return toResponseDTO(savedDeck);
    }

    public List<DeckResponseDTO> findAll() {
        return deckRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DeckResponseDTO> findByLanguage(Language language) {
        return deckRepository.findByLanguage(language).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public DeckResponseDTO findById(UUID id) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Deck not found with id: " + id));
        return toResponseDTO(deck);
    }

    public DeckResponseDTO update(UUID id, DeckRequestDTO requestDTO) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Deck not found with id: " + id));

        deck.setName(requestDTO.name());
        deck.setDescription(requestDTO.description());
        deck.setLanguage(requestDTO.language());

        Deck updatedDeck = deckRepository.save(deck);
        return toResponseDTO(updatedDeck);
    }

    public void deleteById(UUID id) {
        if (!deckRepository.existsById(id)) {
            throw new NotFoundException("Deck not found with id: " + id);
        }
        deckRepository.deleteById(id);
    }

    private DeckResponseDTO toResponseDTO(Deck deck) {
        Long cardCount = deckRepository.countCardsByDeckId(deck.getId());
        return new DeckResponseDTO(
                deck.getId(),
                deck.getName(),
                deck.getDescription(),
                deck.getLanguage(),
                cardCount.intValue(),
                deck.getCreatedAt(),
                deck.getUpdatedAt()
        );
    }
}
