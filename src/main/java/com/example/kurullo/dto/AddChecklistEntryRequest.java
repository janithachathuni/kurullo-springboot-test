package com.example.kurullo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalTime;

@Data
public class AddChecklistEntryRequest {
    private Long birdId;
    private int count;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime timeSeen;

    private String fieldNotes;
}