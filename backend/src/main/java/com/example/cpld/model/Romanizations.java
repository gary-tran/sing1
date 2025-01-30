package com.example.cpld.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "romanizations")
public class Romanizations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "UUID DEFAULT gen_random_uuid()")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lyrics_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Lyrics lyrics;

    @Column(name = "system_name", nullable = false, columnDefinition = "VARCHAR(255)")
    private String systemName;

    @Column(name = "romanized_lyrics", nullable = false, columnDefinition = "TEXT")
    private String romanizedLyrics;

    public Romanizations() {
    }

    public Romanizations(Lyrics lyrics, String systemName, String romanizedLyrics) {
        this.lyrics = lyrics;
        this.systemName = systemName;
        this.romanizedLyrics = romanizedLyrics;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Lyrics getLyrics() {
        return lyrics;
    }

    public void setLyrics(Lyrics lyrics) {
        this.lyrics = lyrics;
    }

    public String getSystemName() {
        return systemName;
    }

    public void setSystemName(String systemName) {
        this.systemName = systemName;
    }

    public String getRomanizedLyrics() {
        return romanizedLyrics;
    }

    public void setRomanizedLyrics(String romanizedLyrics) {
        this.romanizedLyrics = romanizedLyrics;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Romanizations that = (Romanizations) o;
        return Objects.equals(id, that.id) && Objects.equals(lyrics, that.lyrics) && Objects.equals(systemName, that.systemName) && Objects.equals(romanizedLyrics, that.romanizedLyrics);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, lyrics, systemName, romanizedLyrics);
    }

    @Override
    public String toString() {
        return "Romanizations{" +
                "id=" + id +
                ", lyrics=" + lyrics +
                ", systemName='" + systemName + '\'' +
                ", romanizedLyrics='" + romanizedLyrics + '\'' +
                '}';
    }

}
