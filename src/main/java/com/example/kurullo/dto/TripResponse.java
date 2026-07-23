package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TripResponse {
    private Long id;
    private String title;
    private String location;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private String city;
    private String state;
    private String country;
    private LocalDateTime createdAt;
    private long notesCount;
}