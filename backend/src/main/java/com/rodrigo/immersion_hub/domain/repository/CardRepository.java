package com.rodrigo.immersion_hub.domain.repository;

import com.rodrigo.immersion_hub.domain.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {
    
    List<Card> findByDeckId(UUID deckId);
    
    @Query("SELECT c FROM Card c WHERE c.deck.id = :deckId AND c.nextReview <= :now ORDER BY c.nextReview ASC")
    List<Card> findCardsDueForReview(@Param("deckId") UUID deckId, @Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Card c WHERE c.nextReview <= :now ORDER BY c.nextReview ASC")
    List<Card> findAllCardsDueForReview(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Card c WHERE c.deck.id = :deckId AND c.front LIKE %:search% OR c.back LIKE %:search%")
    List<Card> searchCardsInDeck(@Param("deckId") UUID deckId, @Param("search") String search);
    
    Long countByDeckId(UUID deckId);
}
