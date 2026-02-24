package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.api.dto.request.DeckRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.DeckResponseDTO;
import com.rodrigo.immersion_hub.domain.exception.NotFoundException;
import com.rodrigo.immersion_hub.domain.model.Deck;
import com.rodrigo.immersion_hub.domain.model.User;
import com.rodrigo.immersion_hub.domain.repository.DeckRepository;
import com.rodrigo.immersion_hub.domain.enums.Language;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DeckService {

    private final DeckRepository deckRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    public DeckResponseDTO create(DeckRequestDTO requestDTO) {
        User currentUser = getCurrentUser();
        Deck deck = new Deck();
        deck.setId(UUID.randomUUID());
        deck.setUser(currentUser);
        deck.setName(requestDTO.name());
        deck.setDescription(requestDTO.description());
        deck.setLanguage(requestDTO.language());

        Deck savedDeck = deckRepository.save(deck);
        return toResponseDTO(savedDeck);
    }

    public List<DeckResponseDTO> findAll() {
        User currentUser = getCurrentUser();
        return deckRepository.findByUser(currentUser).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<DeckResponseDTO> findByLanguage(Language language) {
        User currentUser = getCurrentUser();
        return deckRepository.findByUserAndLanguage(currentUser, language).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public DeckResponseDTO findById(UUID id) {
        User currentUser = getCurrentUser();
        Optional<Deck> deckOpt = deckRepository.findByIdAndUserId(id, currentUser.getId());
        
        if (deckOpt.isEmpty()) {
            throw new NotFoundException("Deck not found with id: " + id);
        }
        
        return toResponseDTO(deckOpt.get());
    }

    public DeckResponseDTO update(UUID id, DeckRequestDTO requestDTO) {
        User currentUser = getCurrentUser();
        Optional<Deck> deckOpt = deckRepository.findByIdAndUserId(id, currentUser.getId());
        
        if (deckOpt.isEmpty()) {
            throw new NotFoundException("Deck not found with id: " + id);
        }
        
        Deck deck = deckOpt.get();

        deck.setName(requestDTO.name());
        deck.setDescription(requestDTO.description());
        deck.setLanguage(requestDTO.language());

        Deck updatedDeck = deckRepository.save(deck);
        return toResponseDTO(updatedDeck);
    }

    public void deleteById(UUID id) {
        User currentUser = getCurrentUser();
        if (!deckRepository.existsById(id)) {
            throw new NotFoundException("Deck not found with id: " + id);
        }
        
        Optional<Deck> deckOpt = deckRepository.findByIdAndUserId(id, currentUser.getId());
        
        if (deckOpt.isEmpty()) {
            throw new NotFoundException("Deck not found with id: " + id);
        }
        
        deckRepository.delete(deckOpt.get());
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
