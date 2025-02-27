package com.cpld.controller;

import org.springframework.web.bind.annotation.*;

import com.cpld.model.Track;
import com.cpld.service.TracksService;

import java.util.List;

@RestController
@RequestMapping("/api/tracks")
public class TracksController {

    private final TracksService tracksService;

    public TracksController(TracksService tracksService) {
        this.tracksService = tracksService;
    }

    @GetMapping("/search")
    public List<Track> searchTracks(@RequestParam String query) {
        return tracksService.searchTracks(query);
    }

    @GetMapping("/{spotifyId}")
    public Track getTrackBySpotifyId(@PathVariable String spotifyId) {
        return tracksService.getTrackBySpotifyId(spotifyId);
    }
}
