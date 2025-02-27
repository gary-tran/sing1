package com.sing1.service;

import org.springframework.stereotype.Service;

import com.sing1.model.Track;
import com.sing1.repository.TracksRepository;

import java.util.List;

@Service
public class TracksService {

    private final TracksRepository tracksRepository;

    public TracksService(TracksRepository tracksRepository) {
        this.tracksRepository = tracksRepository;
    }

    public List<Track> searchTracks(String query) {
        return tracksRepository.searchTracks(query);
    }

    public Track getTrackBySpotifyId(String spotifyId) {
        return tracksRepository.findTrackBySpotifyId(spotifyId)
                .orElse(null);
    }

}
