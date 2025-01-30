package com.example.cpld.repository;

import com.example.cpld.model.Lyrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LyricsRepository extends JpaRepository<Lyrics, UUID> {

    // SELECT * FROM track WHERE spotify_id = ?
    Optional<Lyrics> findLyricsBySpotifyId(String spotifyId);

}
