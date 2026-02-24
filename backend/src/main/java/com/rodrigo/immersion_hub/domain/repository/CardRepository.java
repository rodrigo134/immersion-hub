package com.rodrigo.immersion_hub.domain.repository;

import com.rodrigo.immersion_hub.domain.model.Card;
import com.rodrigo.immersion_hub.domain.enums.Language;
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
    
    List<Card> findByLanguage(Language language);
    
    List<Card> findByDeckIdAndLanguage(UUID deckId, Language language);
    
    @Query("SELECT c FROM Card c WHERE c.deck.id = :deckId AND c.deck.user.id = :userId")
    List<Card> findByDeckIdAndUserId(@Param("deckId") UUID deckId, @Param("userId") UUID userId);
    
    @Query("SELECT c FROM Card c WHERE c.deck.user.id = :userId")
    List<Card> findByUserId(@Param("userId") UUID userId);
    
    @Query("SELECT c FROM Card c WHERE c.deck.user.id = :userId AND c.language = :language")
    List<Card> findByUserIdAndLanguage(@Param("userId") UUID userId, @Param("language") Language language);
    
    @Query("SELECT c FROM Card c WHERE c.deck.id = :deckId AND c.nextReview <= :now ORDER BY c.nextReview ASC")
    List<Card> findCardsDueForReview(@Param("deckId") UUID deckId, @Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Card c WHERE c.deck.user.id = :userId AND c.nextReview <= :now ORDER BY c.nextReview ASC")
    List<Card> findCardsDueForReviewByUserId(@Param("userId") UUID userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Card c WHERE c.nextReview <= :now ORDER BY c.nextReview ASC")
    List<Card> findAllCardsDueForReview(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Card c WHERE c.deck.id = :deckId AND c.front LIKE %:search% OR c.back LIKE %:search%")
    List<Card> searchCardsInDeck(@Param("deckId") UUID deckId, @Param("search") String search);
    
    @Query("SELECT c FROM Card c WHERE c.deck.user.id = :userId AND (c.front LIKE %:search% OR c.back LIKE %:search%)")
    List<Card> searchCardsByUserId(@Param("userId") UUID userId, @Param("search") String search);
    
    Long countByDeckId(UUID deckId);
}
