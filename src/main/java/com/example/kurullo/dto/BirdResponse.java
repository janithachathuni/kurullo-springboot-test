package com.example.kurullo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BirdResponse {
    private Long id;
    private String primaryName;
    private List<String> otherNames;
    private String scientificName;
    private String orderName;
    private String familyName;
    private String familyCategory;
    private String description;
    private String sinhalaName;
    private String tamilName;
    private String imageUrl;
    private String habitatMapUrl;
    private String frequency;
    private String residency;
    private boolean endemic;
    private String habitat;
    private String places;
    private List<String> notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPrimaryName() { return primaryName; }
    public void setPrimaryName(String primaryName) { this.primaryName = primaryName; }
    public List<String> getOtherNames() { return otherNames; }
    public void setOtherNames(List<String> otherNames) { this.otherNames = otherNames; }
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    public String getOrderName() { return orderName; }
    public void setOrderName(String orderName) { this.orderName = orderName; }
    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }
    public String getFamilyCategory() { return familyCategory; }
    public void setFamilyCategory(String familyCategory) { this.familyCategory = familyCategory; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSinhalaName() { return sinhalaName; }
    public void setSinhalaName(String sinhalaName) { this.sinhalaName = sinhalaName; }
    public String getTamilName() { return tamilName; }
    public void setTamilName(String tamilName) { this.tamilName = tamilName; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getHabitatMapUrl() { return habitatMapUrl; }
    public void setHabitatMapUrl(String habitatMapUrl) { this.habitatMapUrl = habitatMapUrl; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getResidency() { return residency; }
    public void setResidency(String residency) { this.residency = residency; }
    public boolean isEndemic() { return endemic; }
    public void setEndemic(boolean endemic) { this.endemic = endemic; }
    public String getHabitat() { return habitat; }
    public void setHabitat(String habitat) { this.habitat = habitat; }
    public String getPlaces() { return places; }
    public void setPlaces(String places) { this.places = places; }
    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}