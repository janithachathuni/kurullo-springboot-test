package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChecklistEntryResponse {
    private Long id;
    private Long birdId;
    private String birdName;
    private String scientificName;
    private int count;
}