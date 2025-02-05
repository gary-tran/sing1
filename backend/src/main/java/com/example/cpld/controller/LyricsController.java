package com.example.cpld.controller;

import com.example.cpld.model.Lyrics;
import com.example.cpld.model.Track;
import com.example.cpld.service.LyricsService;
import com.example.cpld.service.TracksService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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


//    @GetMapping("/{spotifyId}")
//    public Mono<JsonNode> getLyrics(@PathVariable String spotifyId,
//                                    @RequestParam String trackName,
//                                    @RequestParam String artistName,
//                                    @RequestParam String albumName,
//                                    @RequestParam int duration) {
//        return lyricsService.getLyrics(spotifyId, trackName, artistName,
//                albumName, duration);
//    }

}
