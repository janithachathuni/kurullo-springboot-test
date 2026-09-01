package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChecklistResponse {
    private Long id;
    private String title;
    private Long tripId;
    private String tripPlace;
    private LocalDateTime createdAt;
    private long totalBirdCount;
    private int speciesCount;
    private long notesCount;
}