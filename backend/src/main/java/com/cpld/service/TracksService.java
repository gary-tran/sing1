package com.cpld.service;

import org.springframework.stereotype.Service;

import com.cpld.model.Track;
import com.cpld.repository.TracksRepository;

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
