package com.example.kurullo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.kurullo.model.*;
import com.example.kurullo.repository.BirdRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BirdService {

    private final BirdRepository birdRepository;
    private final Cloudinary cloudinary;

    @Transactional
    public Bird createBird(String primaryName, List<String> otherNames, String scientificName,
                            String order, String family, String description, String sinhalaName,
                            String tamilName, String frequency, String residency, boolean endemic,
                            String places, String habitat, List<String> notes,
                            MultipartFile image, MultipartFile habitatMap) throws IOException {

        if (image == null || image.isEmpty()) {
            throw new RuntimeException("Bird image is required");
        }

        Bird bird = new Bird();
        applyFields(bird, primaryName, otherNames, scientificName, order, family, description,
                sinhalaName, tamilName, frequency, residency, endemic, places, habitat, notes);

        bird.setImageUrl(uploadToCloudinary(image, "birds"));
        if (habitatMap != null && !habitatMap.isEmpty()) {
            bird.setHabitatMapUrl(uploadToCloudinary(habitatMap, "habitat-maps"));
        }

        return birdRepository.save(bird);
    }

    @Transactional
    public Bird updateBird(Long id, String primaryName, List<String> otherNames, String scientificName,
                            String order, String family, String description, String sinhalaName,
                            String tamilName, String frequency, String residency, boolean endemic,
                            String places, String habitat, List<String> notes,
                            MultipartFile image, MultipartFile habitatMap) throws IOException {

        Bird bird = birdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bird not found"));

        applyFields(bird, primaryName, otherNames, scientificName, order, family, description,
                sinhalaName, tamilName, frequency, residency, endemic, places, habitat, notes);

        if (image != null && !image.isEmpty()) {
            bird.setImageUrl(uploadToCloudinary(image, "birds"));
        }
        if (habitatMap != null && !habitatMap.isEmpty()) {
            bird.setHabitatMapUrl(uploadToCloudinary(habitatMap, "habitat-maps"));
        }

        return birdRepository.save(bird);
    }

    public Map<String, Object> getBirdResponse(Long id) {
        Bird bird = birdRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bird not found"));
        return toMap(bird);
    }

    public List<Map<String, Object>> getAllBirdResponses() {
        return birdRepository.findAll().stream()
                .map(this::toMap)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBird(Long id) {
        if (!birdRepository.existsById(id)) {
            throw new RuntimeException("Bird not found");
        }
        birdRepository.deleteById(id);
    }

    // --- helpers ---

    private void applyFields(Bird bird, String primaryName, List<String> otherNames, String scientificName,
                              String order, String family, String description, String sinhalaName,
                              String tamilName, String frequency, String residency, boolean endemic,
                              String places, String habitat, List<String> notes) {

        bird.setPrimaryName(primaryName);
        bird.setScientificName(scientificName);
        bird.setDescription(description);
        bird.setSinhalaName(sinhalaName);
        bird.setTamilName(tamilName);
        bird.setHabitat(habitat);
        bird.setPlaces(places);
        bird.setEndemic(endemic);
        bird.setFrequency(Frequency.valueOf(frequency.trim().toUpperCase().replace(" ", "_")));
        bird.setResidency(Residency.valueOf(residency.trim().toUpperCase()));

        bird.setOtherNames(otherNames == null
                ? new ArrayList<>()
                : otherNames.stream().filter(n -> n != null && !n.isBlank()).collect(Collectors.toList()));
        bird.setNotes(notes == null
                ? new ArrayList<>()
                : notes.stream().filter(n -> n != null && !n.isBlank()).collect(Collectors.toList()));

        try {
            bird.setOrder(BirdOrder.valueOf(order.trim().toUpperCase()));
        } catch (Exception e) {
            throw new RuntimeException("Unknown order: " + order);
        }
        try {
            bird.setFamily(BirdFamily.valueOf(family.trim().toUpperCase()));
        } catch (Exception e) {
            throw new RuntimeException("Unknown family: " + family);
        }
    }

    private String uploadToCloudinary(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "kurullo/" + folder));
        return (String) uploadResult.get("secure_url");
    }

    private Map<String, Object> toMap(Bird bird) {
        Map<String, Object> result = new HashMap<>();
        result.put("id", bird.getId());
        result.put("primaryName", bird.getPrimaryName());
        result.put("otherNames", bird.getOtherNames());
        result.put("scientificName", bird.getScientificName());
        result.put("order", bird.getOrder().getDisplayName());
        result.put("family", bird.getFamily().getDisplayName());
        result.put("familyCategory", bird.getFamily().getCategory());
        result.put("description", bird.getDescription());
        result.put("sinhalaName", bird.getSinhalaName());
        result.put("tamilName", bird.getTamilName());
        result.put("image", bird.getImageUrl());
        result.put("habitatMap", bird.getHabitatMapUrl());
        result.put("frequency", bird.getFrequency().name());
        result.put("residency", bird.getResidency().name());
        result.put("endemic", bird.isEndemic());
        result.put("habitat", bird.getHabitat());
        result.put("places", bird.getPlaces());
        result.put("notes", bird.getNotes());
        return result;
    }
}