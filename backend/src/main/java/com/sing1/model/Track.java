package com.sing1.model;

import jakarta.persistence.*;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "tracks")
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "spotify_id", nullable = false, unique = true, columnDefinition = "VARCHAR(255)")
    private String spotifyId;

    @Column(name = "title", nullable = false,  columnDefinition = "VARCHAR" +
            "(255)")
    private String title;

    @Column(name = "artist", nullable = false,  columnDefinition = "VARCHAR(255)")
    private String artist;

    @Column(name = "album", nullable = false,  columnDefinition = "VARCHAR(255)")
    private String album;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "duration_ms", nullable = false, columnDefinition = "INTEGER")
    private Integer durationMs;

    @Column(name = "release_date", nullable = false, columnDefinition = "VARCHAR(255)")
    private String releaseDate;

    @Column(name = "release_date_precision", nullable = false,
            columnDefinition = "VARCHAR(255)")
    private String releaseDatePrecision;

    @Column(name = "popularity", columnDefinition = "INTEGER")
    private Integer popularity;

    @Column(name = "search_vector", columnDefinition = "tsvector")
    private String searchVector;

    public Track() {
    }

    public Track(String spotifyId, String title, String artist, String album, String imageUrl, Integer durationMs, String releaseDate, String releaseDatePrecision, Integer popularity) {
        this.spotifyId = spotifyId;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.imageUrl = imageUrl;
        this.durationMs = durationMs;
        this.releaseDate = releaseDate;
        this.releaseDatePrecision = releaseDatePrecision;
        this.popularity = popularity;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSpotifyId() {
        return spotifyId;
    }

    public void setSpotifyId(String spotifyId) {
        this.spotifyId = spotifyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Integer durationMs) {
        this.durationMs = durationMs;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getReleaseDatePrecision() {
        return releaseDatePrecision;
    }

    public void setReleaseDatePrecision(String releaseDatePrecision) {
        this.releaseDatePrecision = releaseDatePrecision;
    }

    public Integer getPopularity() {
        return popularity;
    }

    public void setPopularity(Integer popularity) {
        this.popularity = popularity;
    }

    public String getSearchVector() {
        return searchVector;
    }

    public void setSearchVector(String searchVector) {
        this.searchVector = searchVector;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Track track = (Track) o;
        return Objects.equals(id, track.id) && Objects.equals(spotifyId, track.spotifyId) && Objects.equals(title, track.title) && Objects.equals(artist, track.artist) && Objects.equals(album, track.album) && Objects.equals(imageUrl, track.imageUrl) && Objects.equals(durationMs, track.durationMs) && Objects.equals(releaseDate, track.releaseDate) && Objects.equals(releaseDatePrecision, track.releaseDatePrecision) && Objects.equals(popularity, track.popularity) && Objects.equals(searchVector, track.searchVector);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, spotifyId, title, artist, album, imageUrl, durationMs, releaseDate, releaseDatePrecision, popularity, searchVector);
    }

    @Override
    public String toString() {
        return "Track{" +
                "id=" + id +
                ", spotifyId='" + spotifyId + '\'' +
                ", title='" + title + '\'' +
                ", artist='" + artist + '\'' +
                ", album='" + album + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", durationMs=" + durationMs +
                ", releaseDate=" + releaseDate +
                ", releaseDatePrecision='" + releaseDatePrecision + '\'' +
                ", popularity=" + popularity +
                ", searchVector='" + searchVector + '\'' +
                '}';
    }
}
