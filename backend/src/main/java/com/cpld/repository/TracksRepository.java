package com.cpld.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cpld.model.Track;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TracksRepository extends JpaRepository<Track, UUID> {

    @Query(value = "SELECT *, ts_rank(search_vector, plainto_tsquery('simple', :query)) AS rank " +
            "FROM tracks " +
            "WHERE search_vector @@ plainto_tsquery('simple', :query) " +
            "ORDER BY rank DESC " +
            "LIMIT 24",
            nativeQuery = true)
    List<Track> searchTracks(@Param("query") String query);

    // SELECT * FROM tracks WHERE spotify_id = ?
    Optional<Track> findTrackBySpotifyId(String spotifyId);

}