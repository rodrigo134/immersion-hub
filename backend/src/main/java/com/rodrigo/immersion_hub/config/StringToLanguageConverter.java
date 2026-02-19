package com.rodrigo.immersion_hub.config;

import com.rodrigo.immersion_hub.domain.enums.Language;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToLanguageConverter implements Converter<String, Language> {

    @Override
    public Language convert(String source) {
        if (source == null) {
            return null;
        }
        
        // Mapeamento de siglas para enums
        switch (source.toUpperCase()) {
            case "EN":
                return Language.ENGLISH;
            case "PT":
                return Language.PORTUGUESE;
            case "DE":
                return Language.GERMAN;
            case "ES":
                return Language.SPANISH;
            case "FR":
                return Language.FRENCH;
            case "IT":
                return Language.ITALIAN;
            case "JA":
                return Language.JAPANESE;
            case "ZH":
                return Language.CHINESE;
            case "KO":
                return Language.KOREAN;
            case "RU":
                return Language.RUSSIAN;
            default:
                // Tenta converter pelo nome completo se não for sigla
                try {
                    return Language.valueOf(source.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return null;
                }
        }
    }
}
