// dto/BirdTagResponse.java
package com.example.kurullo.dto;

public class BirdTagResponse {
    private Long id;
    private String primaryName;

    public BirdTagResponse(Long id, String primaryName) {
        this.id = id;
        this.primaryName = primaryName;
    }

    public Long getId() { return id; }
    public String getPrimaryName() { return primaryName; }
}