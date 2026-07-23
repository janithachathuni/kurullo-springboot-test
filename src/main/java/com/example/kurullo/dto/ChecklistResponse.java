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
    private LocalDateTime createdAt;
    private long totalBirdCount; // sum of all entry counts
    private int speciesCount;    // number of distinct entries
    private long notesCount;
}