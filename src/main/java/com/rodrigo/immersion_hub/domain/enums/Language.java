package com.rodrigo.immersion_hub.domain.enums;

public enum Language {
    ENGLISH("en"),
    PORTUGUESE("pt"),
    GERMAN("de"),
    SPANISH("es"),
    FRENCH("fr"),
    ITALIAN("it"),
    JAPANESE("ja"),
    CHINESE("zh"),
    KOREAN("ko"),
    RUSSIAN("ru");

    private final String isoCode;

    Language(String isoCode) {
        this.isoCode = isoCode;
    }

    public String getIsoCode() {
        return isoCode;
    }
}
