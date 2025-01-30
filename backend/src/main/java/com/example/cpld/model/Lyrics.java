package com.example.cpld.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "lyrics")
public class Lyrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID DEFAULT gen_random_uuid()")
    private UUID id;

    @Column(name = "spotify_id", nullable = false, unique = true, columnDefinition = "VARCHAR(255)")
    private String spotifyId;

    @Column(name = "synced_lyrics", columnDefinition = "TEXT")
    private String syncedLyrics;

    @Column(name = "plain_lyrics_simplified", columnDefinition = "TEXT")
    private String plainLyricsSimplified;

    @Column(name = "plain_lyrics_traditional", columnDefinition = "TEXT")
    private String plainLyricsTraditional;

    @Column(name = "is_instrumental", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isInstrumental = false;

    @OneToMany(mappedBy = "lyrics", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Romanizations> romanizationsList;

    public Lyrics() {
    }

    public Lyrics(String spotifyId, String syncedLyrics, String plainLyricsSimplified, String plainLyricsTraditional, Boolean isInstrumental) {
        this.spotifyId = spotifyId;
        this.syncedLyrics = syncedLyrics;
        this.plainLyricsSimplified = plainLyricsSimplified;
        this.plainLyricsTraditional = plainLyricsTraditional;
        this.isInstrumental = isInstrumental;
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

    public String getSyncedLyrics() {
        return syncedLyrics;
    }

    public void setSyncedLyrics(String syncedLyrics) {
        this.syncedLyrics = syncedLyrics;
    }

    public String getPlainLyricsSimplified() {
        return plainLyricsSimplified;
    }

    public void setPlainLyricsSimplified(String plainLyricsSimplified) {
        this.plainLyricsSimplified = plainLyricsSimplified;
    }

    public String getPlainLyricsTraditional() {
        return plainLyricsTraditional;
    }

    public void setPlainLyricsTraditional(String plainLyricsTraditional) {
        this.plainLyricsTraditional = plainLyricsTraditional;
    }

    public Boolean getInstrumental() {
        return isInstrumental;
    }

    public void setInstrumental(Boolean instrumental) {
        isInstrumental = instrumental;
    }

    public List<Romanizations> getRomanizationsList() {
        return romanizationsList;
    }

    public void setRomanizationsList(List<Romanizations> romanizationsList) {
        this.romanizationsList = romanizationsList;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Lyrics lyrics = (Lyrics) o;
        return Objects.equals(id, lyrics.id) && Objects.equals(spotifyId, lyrics.spotifyId) && Objects.equals(syncedLyrics, lyrics.syncedLyrics) && Objects.equals(plainLyricsSimplified, lyrics.plainLyricsSimplified) && Objects.equals(plainLyricsTraditional, lyrics.plainLyricsTraditional) && Objects.equals(isInstrumental, lyrics.isInstrumental) && Objects.equals(romanizationsList, lyrics.romanizationsList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, spotifyId, syncedLyrics, plainLyricsSimplified, plainLyricsTraditional, isInstrumental, romanizationsList);
    }

    @Override
    public String toString() {
        return "Lyrics{" +
                "id=" + id +
                ", spotifyId='" + spotifyId + '\'' +
                ", syncedLyrics='" + syncedLyrics + '\'' +
                ", plainLyricsSimplified='" + plainLyricsSimplified + '\'' +
                ", plainLyricsTraditional='" + plainLyricsTraditional + '\'' +
                ", isInstrumental=" + isInstrumental +
                ", romanizationsList=" + romanizationsList +
                '}';
    }
}