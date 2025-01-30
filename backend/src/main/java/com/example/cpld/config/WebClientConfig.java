package com.example.cpld.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient spotifyAuthWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://accounts.spotify.com/api/token")
                .build();
    }

    @Bean
    public WebClient spotifyApiWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://api.spotify.com/v1")
                .build();
    }

    @Bean
    public WebClient lrclibApiWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://lrclib.net/api")
                .build();
    }
    
}
