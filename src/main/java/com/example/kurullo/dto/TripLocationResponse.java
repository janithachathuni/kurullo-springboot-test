package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TripLocationResponse {
    private Long id;
    private String title;
    private String location;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
}