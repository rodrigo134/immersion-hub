package com.rodrigo.immersion_hub.domain.repository;

import com.rodrigo.immersion_hub.domain.model.Deck;
import com.rodrigo.immersion_hub.domain.enums.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeckRepository extends JpaRepository<Deck, UUID> {
    
    List<Deck> findByLanguage(Language language);
    
    List<Deck> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT d FROM Deck d WHERE d.id = :deckId")
    Deck findByIdWithCards(@Param("deckId") UUID deckId);
    
    @Query("SELECT COUNT(c) FROM Card c WHERE c.deck.id = :deckId")
    Long countCardsByDeckId(@Param("deckId") UUID deckId);
}
