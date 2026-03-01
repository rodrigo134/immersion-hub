package com.rodrigo.immersion_hub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite requisições do frontend específico e localhost para desenvolvimento
        configuration.setAllowedOrigins(Arrays.asList(
            "https://immersion-hub-phi.vercel.app",
            "https://immersion-hub.onrender.com",
            "http://localhost:5173",
            "http://localhost:3000"
        ));
        
        // Permite os métodos HTTP comuns
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Permite todos os headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Permite credenciais (cookies, headers de autorização)
        configuration.setAllowCredentials(true);
        
        // Permite expor headers específicos para o frontend
        configuration.setExposedHeaders(Arrays.asList("*"));
        
        // Configura o tempo de cache das opções CORS (1 hora)
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
