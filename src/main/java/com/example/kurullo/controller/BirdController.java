package com.example.kurullo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.kurullo.dto.BirdPhotoResponse;
import com.example.kurullo.model.Bird;
import com.example.kurullo.model.PostPhoto;
import com.example.kurullo.repository.PostPhotoRepository;
import com.example.kurullo.service.BirdService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/birds")
@RequiredArgsConstructor
public class BirdController {

    private final BirdService birdService;

    @PostMapping
    public ResponseEntity<?> createBird(
            @RequestParam("primaryName") String primaryName,
            @RequestParam(value = "otherNames", required = false) List<String> otherNames,
            @RequestParam("scientificName") String scientificName,
            @RequestParam("order") String order,
            @RequestParam("family") String family,
            @RequestParam("description") String description,
            @RequestParam(value = "sinhalaName", required = false) String sinhalaName,
            @RequestParam(value = "tamilName", required = false) String tamilName,
            @RequestParam("frequency") String frequency,
            @RequestParam("residency") String residency,
            @RequestParam(value = "endemic", defaultValue = "false") boolean endemic,
            @RequestParam(value = "places", required = false) String places,
            @RequestParam(value = "habitat", required = false) String habitat,
            @RequestParam(value = "notes", required = false) List<String> notes,
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "habitatMap", required = false) MultipartFile habitatMap
    ) {
        try {
            Bird bird = birdService.createBird(
                    primaryName, otherNames, scientificName, order, family, description,
                    sinhalaName, tamilName, frequency, residency, endemic, places, habitat,
                    notes, image, habitatMap
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Bird created successfully",
                    "id", bird.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBird(
            @PathVariable Long id,
            @RequestParam("primaryName") String primaryName,
            @RequestParam(value = "otherNames", required = false) List<String> otherNames,
            @RequestParam("scientificName") String scientificName,
            @RequestParam("order") String order,
            @RequestParam("family") String family,
            @RequestParam("description") String description,
            @RequestParam(value = "sinhalaName", required = false) String sinhalaName,
            @RequestParam(value = "tamilName", required = false) String tamilName,
            @RequestParam("frequency") String frequency,
            @RequestParam("residency") String residency,
            @RequestParam(value = "endemic", defaultValue = "false") boolean endemic,
            @RequestParam(value = "places", required = false) String places,
            @RequestParam(value = "habitat", required = false) String habitat,
            @RequestParam(value = "notes", required = false) List<String> notes,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "habitatMap", required = false) MultipartFile habitatMap
    ) {
        try {
            Bird bird = birdService.updateBird(
                    id, primaryName, otherNames, scientificName, order, family, description,
                    sinhalaName, tamilName, frequency, residency, endemic, places, habitat,
                    notes, image, habitatMap
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Bird updated successfully",
                    "id", bird.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBird(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(birdService.getBirdResponse(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllBirds() {
        try {
            return ResponseEntity.ok(birdService.getAllBirdResponses());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBird(@PathVariable Long id) {
        try {
            birdService.deleteBird(id);
            return ResponseEntity.ok(Map.of("message", "Bird deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Autowired
    private PostPhotoRepository postPhotoRepository;

    @GetMapping("/{id}/photos")
    public ResponseEntity<List<BirdPhotoResponse>> getBirdPhotos(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean featuredOnly
    ) {
        List<PostPhoto> photos = featuredOnly
                ? postPhotoRepository.findFeaturedByBirdId(id)
                : postPhotoRepository.findByBirdId(id);

        List<BirdPhotoResponse> response = photos.stream()
                .map(p -> new BirdPhotoResponse(p.getId(), p.getImageUrl(), p.isFeatured()))
                .toList();

        return ResponseEntity.ok(response);
}
}