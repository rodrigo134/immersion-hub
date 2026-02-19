package com.rodrigo.immersion_hub.domain.model;

import com.rodrigo.immersion_hub.domain.enums.SourceCategory;
import com.rodrigo.immersion_hub.domain.enums.Language;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "sources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Source {


    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String url;

    @Column(length = 500)
    private String description;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SourceCategory category;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Language language;

}
