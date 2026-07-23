package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BirdSoundResponse {
    private String id;
    private String englishName;
    private String recordist;
    private String country;
    private String location;
    private String length;
    private String quality;
    private String fileUrl;
}