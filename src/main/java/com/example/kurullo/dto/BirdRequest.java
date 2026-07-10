package com.example.kurullo.dto;

import java.util.List;

public class BirdRequest {
    private String primaryName;
    private List<String> otherNames;
    private String scientificName;
    private String order;       // matches by name, resolved server-side
    private String family;      // matches by name, resolved server-side
    private String description;
    private String sinhalaName;
    private String tamilName;
    private String frequency;   // "Very Common" etc, mapped to enum
    private String residency;
    private boolean endemic;
    private String places;
    private String habitat;
    private List<String> notes;

    // Getters and setters
    public String getPrimaryName() { return primaryName; }
    public void setPrimaryName(String primaryName) { this.primaryName = primaryName; }
    public List<String> getOtherNames() { return otherNames; }
    public void setOtherNames(List<String> otherNames) { this.otherNames = otherNames; }
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    public String getOrder() { return order; }
    public void setOrder(String order) { this.order = order; }
    public String getFamily() { return family; }
    public void setFamily(String family) { this.family = family; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSinhalaName() { return sinhalaName; }
    public void setSinhalaName(String sinhalaName) { this.sinhalaName = sinhalaName; }
    public String getTamilName() { return tamilName; }
    public void setTamilName(String tamilName) { this.tamilName = tamilName; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getResidency() { return residency; }
    public void setResidency(String residency) { this.residency = residency; }
    public boolean isEndemic() { return endemic; }
    public void setEndemic(boolean endemic) { this.endemic = endemic; }
    public String getPlaces() { return places; }
    public void setPlaces(String places) { this.places = places; }
    public String getHabitat() { return habitat; }
    public void setHabitat(String habitat) { this.habitat = habitat; }
    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> notes) { this.notes = notes; }
}