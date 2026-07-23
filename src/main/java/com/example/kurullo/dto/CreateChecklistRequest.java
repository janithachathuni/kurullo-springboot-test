package com.example.kurullo.dto;

import lombok.Data;

@Data
public class CreateChecklistRequest {
    private String title;
    private Long tripId; // nullable — omit or null for a standalone checklist
}