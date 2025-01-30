package com.example.cpld.controller;

import com.example.cpld.service.LyricsService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/lyrics")
public class LyricsController {

    private final LyricsService lyricsService;

    public LyricsController(LyricsService lyricsService) {
        this.lyricsService = lyricsService;
    }

    @GetMapping("/{spotifyId}")
    public Mono<JsonNode> getLyrics(@PathVariable String spotifyId,
                                    @RequestParam String trackName,
                                    @RequestParam String artistName,
                                    @RequestParam String albumName,
                                    @RequestParam int duration) {
        return lyricsService.getLyrics(spotifyId, trackName, artistName,
                albumName, duration);
    }

}
