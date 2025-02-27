package com.sing1.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.sing1.model.Lyrics;
import com.sing1.model.Romanizations;
import com.sing1.model.Track;
import com.sing1.repository.LyricsRepository;
import com.sing1.repository.RomanizationsRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Paths;
import java.util.*;

@Service
public class LyricsService {

    private final WebClient lrclibApiWebClient;
    private final LyricsRepository lyricsRepository;
    private final RomanizationsRepository romanizationsRepository;

    public LyricsService(WebClient lrclibApiWebClient,
                         LyricsRepository lyricsRepository,
                         RomanizationsRepository romanizationsRepository) {
        this.lrclibApiWebClient = lrclibApiWebClient;
        this.lyricsRepository = lyricsRepository;
        this.romanizationsRepository = romanizationsRepository;
    }

    public Mono<JsonNode> getLyrics(Track track, String spotifyId,
                                    String trackName,
                                    String artistName, String albumName,
                                    int duration) {
        Optional<Lyrics> lyricsOptional =
                lyricsRepository.findLyricsBySpotifyId(spotifyId);
        if (lyricsOptional.isPresent()) {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode result = objectMapper.valueToTree(lyricsOptional.get());
            return Mono.just(result);
        } else {
            return fetchLyricsFromApi(trackName, artistName, albumName, duration)
                    .map(lyrics -> {
                        String plainLyrics =
                                lyrics.get("plainLyrics").asText().replace("\n", "\\n");
                        String plainLyricsTraditional =
                                convertSimplifiedTraditional(plainLyrics,
                                        "s2t");
                        String plainLyricsSimplified =
                                convertSimplifiedTraditional(plainLyrics,
                                        "t2s");

                        Lyrics trackLyrics = new Lyrics(spotifyId,
                                lyrics.get("syncedLyrics").asText(),
                                plainLyricsSimplified.replace("\n", "\\n"),
                                plainLyricsTraditional.replace("\n", "\\n"),
                                lyrics.get("instrumental").asBoolean(),
                                track);
                        Lyrics savedLyrics = lyricsRepository.save(trackLyrics);

                        Map<String, String> romanizationMap = new HashMap<>();
                        romanizationMap.put("yaleToneNumbers", "yale_tone_numbers");
                        romanizationMap.put("yaleToneDiacritics", "yale_tone_diacritics");
                        romanizationMap.put("cantonesePinyin", "cantonese_pinyin");
                        romanizationMap.put("slWongToneNumbers", "sl_wong_tone_numbers");
                        romanizationMap.put("slWongToneDiacritics", "sl_wong_tone_diacritics");
                        romanizationMap.put("ipa", "ipa");
                        romanizationMap.put("jyutping", "jyutping");
                        romanizationMap.put("cantonPinyin", "canton_pinyin");
                        romanizationMap.put("sidneyLau", "sidney_lau");
                        romanizationMap.put("penkyampToneNumbers", "penkyamp_tone_numbers");
                        romanizationMap.put("penkyampToneDiacritics", "penkyamp_tone_diacritics");

                        String jyutpingLyrics =
                                convertToJyutpingLyrics(plainLyricsTraditional);
                        List<Romanizations> romanizationsList = new ArrayList<>();
                        JsonNode romanizations = convertToRomanizations(jyutpingLyrics);
                        romanizations.fields().forEachRemaining(field -> {
                            Romanizations romanization = new Romanizations(
                                    savedLyrics,
                                    romanizationMap.get(field.getKey()),
                                    field.getValue().asText()
                            );
                            romanizationsRepository.save(romanization);
                            romanizationsList.add(romanization);
                        });
                        savedLyrics.setRomanizationsList(romanizationsList);
                        
                        ObjectMapper objectMapper = new ObjectMapper();
                        JsonNode result = objectMapper.valueToTree(savedLyrics);
                        return result;
                    }).switchIfEmpty(Mono.defer(() -> {
                        Lyrics defaultLyrics = new Lyrics(spotifyId,
                                "",
                                "",
                                "",
                                false,
                                track);

                        ObjectMapper objectMapper = new ObjectMapper();
                        JsonNode defaultJsonNode = objectMapper.valueToTree(defaultLyrics);
                        return Mono.just(defaultJsonNode);
                    }));
                    
        }

    }

    public Mono<JsonNode> fetchLyricsFromApi(String trackName,
                                             String artistName, String albumName, int duration) {
        JsonNode result = null;
        List<Map<String, Object>> qParams = List.of(
                Map.of("track_name", trackName, "artist_name", artistName,
                        "album_name", albumName, "duration", duration),
                Map.of("track_name", trackName, "artist_name", artistName,
                        "duration", duration),
                Map.of("track_name", trackName, "artist_name", artistName));

        for (Map<String, Object> qParam : qParams) {
            try {
                result = lrclibApiWebClient.get()
                        .uri(uriBuilder -> {
                            uriBuilder.path("/get");
                            qParam.forEach((key, value) -> uriBuilder.queryParam(key, value));
                            return uriBuilder.build();
                        })
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .block();

                if (result != null) {
                    break;
                }

            } catch (Exception e) {
                System.err.println("Error fetching lyrics for track: " + trackName + " by: " + artistName + " - " + e);
                if (!(e instanceof WebClientResponseException.NotFound)) {
                    break;
                }
            }
        }

        if (result != null) {
            return Mono.just(result);
        } else {
            return Mono.empty();
        }
    }

    public String convertSimplifiedTraditional(String plainLyrics,
                                            String conversionType) {
        try {
            String pythonFilePath = Paths.get( "scripts", "convert_simplified_traditional.py").toString();
            String pythonExecutable = Paths.get("..", "myenv", "bin", "python3").toString();

            List<String> command = new ArrayList<>();
            command.add(pythonExecutable);
            command.add(pythonFilePath);
            command.add(plainLyrics);
            command.add(conversionType);

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.readLine();

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return output != null ? output.trim() : "";
            } else {
                return "Error occurred while executing script. Exit code: " + exitCode;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Exception while executing Python script: " + e.getMessage();
        }

    }

    public String convertToJyutpingLyrics(String plainLyrics) {
        try {
            String pythonFilePath = Paths.get( "scripts", "convert_jyutping.py").toString();
            String pythonExecutable = Paths.get("..", "myenv", "bin", "python3").toString();

            List<String> command = new ArrayList<>();
            command.add(pythonExecutable);
            command.add(pythonFilePath);
            command.add(plainLyrics);

            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader =
                    new BufferedReader(new InputStreamReader(process.getInputStream()));
            String output = reader.readLine();

            int exitCode = process.waitFor();
            if (exitCode == 0) {
                return output != null ? output.trim() : "";
            } else {
                return "Error occurred while executing script. Exit code: " + exitCode;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Exception while executing Python script: " + e.getMessage();
        }

    }

    public JsonNode convertToRomanizations(String jyutpingLyrics) {
        ObjectNode romanizations = JsonNodeFactory.instance.objectNode();

        String[] romanizationSystems = {
                "yaleToneNumbers",       // 0
                "yaleToneDiacritics",    // 1
                "cantonesePinyin",       // 2
                "slWongToneNumbers",     // 3
                "slWongToneDiacritics",  // 4
                "ipa",                   // 5
                "jyutping",              // 6
                "cantonPinyin",          // 7
                "sidneyLau",             // 8
                "penkyampToneNumbers",   // 9
                "penkyampToneDiacritics" // 10
        };

        try {
            String pythonFilePath = Paths.get( "scripts", "convert_pingyam.py").toString();
            String pythonExecutable = Paths.get("..", "myenv", "bin", "python3").toString();

            for (int i = 0; i <= 10; i++) {
                List<String> command = new ArrayList<>();
                command.add(pythonExecutable);
                command.add(pythonFilePath);
                command.add(jyutpingLyrics);
                command.add(String.valueOf(i));

                ProcessBuilder processBuilder = new ProcessBuilder(command);
                processBuilder.redirectErrorStream(true);

                Process process = processBuilder.start();

                try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                    String output = reader.readLine();

                    int exitCode = process.waitFor();
                    if (exitCode == 0) {
                        if (output != null) {
                            romanizations.put(romanizationSystems[i], output.trim());
                        }
                    } else {
                        System.err.println("Error: Script failed for " + romanizationSystems[i] + ". Exit code: " + exitCode);
                    }
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Exception occurred: " + e.getMessage());
        }

        return romanizations;
    }

}
