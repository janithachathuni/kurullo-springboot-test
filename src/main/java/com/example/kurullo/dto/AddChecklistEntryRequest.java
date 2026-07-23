package com.example.kurullo.dto;

import lombok.Data;

@Data
public class AddChecklistEntryRequest {
    private Long birdId;
    private int count;
}