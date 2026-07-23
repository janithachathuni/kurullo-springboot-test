package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TripStatsResponse {
    private long tripsThisYear;
    private long tripsAllTime;
    private long placesThisYear;
    private long placesAllTime;
}