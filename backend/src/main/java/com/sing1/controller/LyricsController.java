package com.sing1.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.sing1.model.Track;
import com.sing1.service.LyricsService;
import com.sing1.service.TracksService;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/lyrics")
public class LyricsController {

    private final LyricsService lyricsService;
    private final TracksService tracksService;

    public LyricsController(LyricsService lyricsService, TracksService tracksService) {
        this.lyricsService = lyricsService;
        this.tracksService = tracksService;
    }

    @GetMapping("/{spotifyId}")
    public Mono<JsonNode> getTrackWithLyrics(@PathVariable String spotifyId) {
        Track track = tracksService.getTrackBySpotifyId(spotifyId);
        return lyricsService.getLyrics(track,
                track.getSpotifyId(),
                track.getTitle(),
                track.getArtist(),
                track.getAlbum(),
                (int) Math.floor(track.getDurationMs() / 1000));
    }

}
