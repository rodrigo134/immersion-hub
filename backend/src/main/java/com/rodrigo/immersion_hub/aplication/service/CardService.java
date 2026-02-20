package com.rodrigo.immersion_hub.aplication.service;

import com.rodrigo.immersion_hub.api.dto.request.CardRequestDTO;
import com.rodrigo.immersion_hub.api.dto.response.CardResponseDTO;
import com.rodrigo.immersion_hub.domain.enums.Language;
import com.rodrigo.immersion_hub.domain.exception.NotFoundException;
import com.rodrigo.immersion_hub.domain.model.Card;
import com.rodrigo.immersion_hub.domain.model.Deck;
import com.rodrigo.immersion_hub.domain.repository.CardRepository;
import com.rodrigo.immersion_hub.domain.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CardService {

    private final CardRepository cardRepository;
    private final DeckRepository deckRepository;

    public CardResponseDTO create(CardRequestDTO requestDTO) {
        Deck deck = deckRepository.findById(requestDTO.deckId())
                .orElseThrow(() -> new NotFoundException("Deck not found with id: " + requestDTO.deckId()));

        Card card = new Card();
        card.setId(UUID.randomUUID());
        card.setDeck(deck);
        card.setLanguage(requestDTO.language());
        card.setFront(requestDTO.front());
        card.setBack(requestDTO.back());
        card.setContext(requestDTO.context());
        card.setDifficulty(requestDTO.difficulty() != null ? requestDTO.difficulty() : 0);

        Card savedCard = cardRepository.save(card);
        return toResponseDTO(savedCard);
    }

    public List<CardResponseDTO> findByDeckId(UUID deckId) {
        if (!deckRepository.existsById(deckId)) {
            throw new NotFoundException("Deck not found with id: " + deckId);
        }
        return cardRepository.findByDeckId(deckId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<CardResponseDTO> findByLanguage(Language language) {
        return cardRepository.findByLanguage(language).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<CardResponseDTO> findByDeckIdAndLanguage(UUID deckId, Language language) {
        if (!deckRepository.existsById(deckId)) {
            throw new NotFoundException("Deck not found with id: " + deckId);
        }
        return cardRepository.findByDeckIdAndLanguage(deckId, language).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CardResponseDTO findById(UUID id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found with id: " + id));
        return toResponseDTO(card);
    }

    public List<CardResponseDTO> getCardsDueForReview(UUID deckId) {
        if (!deckRepository.existsById(deckId)) {
            throw new NotFoundException("Deck not found with id: " + deckId);
        }
        return cardRepository.findCardsDueForReview(deckId, LocalDateTime.now()).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public CardResponseDTO update(UUID id, CardRequestDTO requestDTO) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found with id: " + id));

        if (!card.getDeck().getId().equals(requestDTO.deckId())) {
            Deck newDeck = deckRepository.findById(requestDTO.deckId())
                    .orElseThrow(() -> new NotFoundException("Deck not found with id: " + requestDTO.deckId()));
            card.setDeck(newDeck);
        }

        card.setFront(requestDTO.front());
        card.setBack(requestDTO.back());
        card.setContext(requestDTO.context());
        card.setLanguage(requestDTO.language());
        if (requestDTO.difficulty() != null) {
            card.setDifficulty(requestDTO.difficulty());
        }

        Card updatedCard = cardRepository.save(card);
        return toResponseDTO(updatedCard);
    }

    public void deleteById(UUID id) {
        if (!cardRepository.existsById(id)) {
            throw new NotFoundException("Card not found with id: " + id);
        }
        cardRepository.deleteById(id);
    }

    public CardResponseDTO updateReviewProgress(UUID id, int quality) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found with id: " + id));

        updateSpacedRepetition(card, quality);
        Card updatedCard = cardRepository.save(card);
        return toResponseDTO(updatedCard);
    }

    private void updateSpacedRepetition(Card card, int quality) {
        card.setRepetitions(card.getRepetitions() + 1);
        
        if (quality >= 3) {
            if (card.getRepetitions() == 1) {
                card.setInterval(1);
            } else if (card.getRepetitions() == 2) {
                card.setInterval(6);
            } else {
                card.setInterval((int) Math.round(card.getInterval() * 2.5));
            }
        } else {
            card.setInterval(1);
            card.setRepetitions(0);
        }

        card.setNextReview(LocalDateTime.now().plusDays(card.getInterval()));
    }

    private CardResponseDTO toResponseDTO(Card card) {
        return new CardResponseDTO(
                card.getId(),
                card.getDeck().getId(),
                card.getLanguage(),
                card.getFront(),
                card.getBack(),
                card.getContext(),
                card.getDifficulty(),
                card.getInterval(),
                card.getRepetitions(),
                card.getNextReview(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}
