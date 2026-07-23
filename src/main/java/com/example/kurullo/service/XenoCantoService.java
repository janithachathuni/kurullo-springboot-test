package com.example.kurullo.service;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.kurullo.dto.BirdSoundResponse;

@Service
public class XenoCantoService {

    private final RestTemplate restTemplate;

    @Value("${xenocanto.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://xeno-canto.org/api/3/recordings";

    public XenoCantoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @SuppressWarnings("unchecked")
    public List<BirdSoundResponse> getSoundsByScientificName(String scientificName) {
        if (scientificName == null || scientificName.isBlank()) {
            return new ArrayList<>();
        }

        String[] parts = scientificName.trim().split("\\s+");
        String genus = parts[0];
        String species = parts.length > 1 ? parts[1] : "";

        String query = species.isBlank()
                ? "gen:" + genus
                : "gen:" + genus + " sp:" + species;

        URI uri = UriComponentsBuilder.fromUriString(BASE_URL)
            .queryParam("query", query)
            .queryParam("key", apiKey)
            .queryParam("per_page", 1)
            .build()
            .encode()
            .toUri();

        System.out.println("Full URL: " + uri);

        Map<String, Object> response;
        try {
            response = restTemplate.getForObject(uri, Map.class);
            System.out.println("XenoCanto raw response: " + response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch sounds from Xeno-canto", e);
        }

        if (response == null || response.get("recordings") == null) {
            return new ArrayList<>();
        }

        List<Map<String, Object>> recordings = (List<Map<String, Object>>) response.get("recordings");
        List<BirdSoundResponse> results = new ArrayList<>();

        for (Map<String, Object> rec : recordings) {
            results.add(new BirdSoundResponse(
                    String.valueOf(rec.get("id")),
                    String.valueOf(rec.getOrDefault("en", "")),
                    String.valueOf(rec.getOrDefault("rec", "")),
                    String.valueOf(rec.getOrDefault("cnt", "")),
                    String.valueOf(rec.getOrDefault("loc", "")),
                    String.valueOf(rec.getOrDefault("length", "")),
                    String.valueOf(rec.getOrDefault("q", "")),
                    String.valueOf(rec.getOrDefault("file", ""))
            ));
        }

        return results;
    }
}