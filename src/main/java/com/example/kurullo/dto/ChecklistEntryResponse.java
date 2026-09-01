package com.example.kurullo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ChecklistEntryResponse {
    private Long id;
    private Long birdId;
    private String birdName;
    private String scientificName;
    private int count;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeSeen;

    private String fieldNotes;
}