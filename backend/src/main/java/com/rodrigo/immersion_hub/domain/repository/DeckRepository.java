package com.rodrigo.immersion_hub.domain.repository;

import com.rodrigo.immersion_hub.domain.model.Deck;
import com.rodrigo.immersion_hub.domain.model.User;
import com.rodrigo.immersion_hub.domain.enums.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeckRepository extends JpaRepository<Deck, UUID> {
    
    List<Deck> findByUser(User user);
    
    List<Deck> findByUserId(UUID userId);
    
    List<Deck> findByUserAndLanguage(User user, Language language);
    
    List<Deck> findByUserIdAndLanguage(UUID userId, Language language);
    
    List<Deck> findByUserAndNameContainingIgnoreCase(User user, String name);
    
    List<Deck> findByUserIdAndNameContainingIgnoreCase(UUID userId, String name);
    
    List<Deck> findByLanguage(Language language);
    
    List<Deck> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT d FROM Deck d WHERE d.id = :deckId AND d.user.id = :userId")
    Optional<Deck> findByIdAndUserId(@Param("deckId") UUID deckId, @Param("userId") UUID userId);
    
    @Query("SELECT d FROM Deck d WHERE d.id = :deckId")
    Deck findByIdWithCards(@Param("deckId") UUID deckId);
    
    @Query("SELECT COUNT(c) FROM Card c WHERE c.deck.id = :deckId")
    Long countCardsByDeckId(@Param("deckId") UUID deckId);
}
