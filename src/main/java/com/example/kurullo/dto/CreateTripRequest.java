package com.example.kurullo.dto;

import lombok.Data;

@Data
public class CreateTripRequest {
    private String title;
    private String location;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private String placeId;
    private String city;
    private String state;
    private String country;
}