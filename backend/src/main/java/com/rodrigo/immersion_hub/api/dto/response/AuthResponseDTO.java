package com.rodrigo.immersion_hub.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    
    private String token;
    private String type = "Bearer";
    private String username;
}
