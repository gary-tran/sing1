package com.cpld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cpld.model.Lyrics;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LyricsRepository extends JpaRepository<Lyrics, UUID> {

    // SELECT * FROM lyrics WHERE spotify_id = ?
    Optional<Lyrics> findLyricsBySpotifyId(String spotifyId);

}
