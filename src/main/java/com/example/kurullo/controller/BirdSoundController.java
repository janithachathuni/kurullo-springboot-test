package com.example.kurullo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kurullo.dto.BirdSoundResponse;
import com.example.kurullo.model.Bird;
import com.example.kurullo.repository.BirdRepository;
import com.example.kurullo.service.XenoCantoService;

@RestController
@RequestMapping("/api/birds")
public class BirdSoundController {

    @Autowired
    private XenoCantoService xenoCantoService;

    @Autowired
    private BirdRepository birdRepository;

    @GetMapping("/{birdId}/sounds")
    public ResponseEntity<List<BirdSoundResponse>> getBirdSounds(@PathVariable Long birdId) {
        Bird bird = birdRepository.findById(birdId)
                .orElseThrow(() -> new IllegalArgumentException("Bird not found with id: " + birdId));

        List<BirdSoundResponse> sounds = xenoCantoService.getSoundsByScientificName(bird.getScientificName());
        return ResponseEntity.ok(sounds);
    }
}