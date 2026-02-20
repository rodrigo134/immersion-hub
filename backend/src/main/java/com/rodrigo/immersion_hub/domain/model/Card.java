package com.rodrigo.immersion_hub.domain.model;

import com.rodrigo.immersion_hub.domain.enums.Language;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Card {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

    @Column(nullable = false)
    private String front;

    @Column(nullable = false)
    private String back;

    @Column(length = 1000)
    private String context;

    @Column(nullable = false)
    private Integer difficulty;

    @Column(nullable = false)
    private Integer interval;

    @Column(nullable = false)
    private Integer repetitions;

    @Column(nullable = false)
    private LocalDateTime nextReview;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        nextReview = LocalDateTime.now();
        interval = 1;
        repetitions = 0;
        difficulty = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
