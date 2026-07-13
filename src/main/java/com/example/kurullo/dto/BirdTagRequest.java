// dto/BirdTagRequest.java
package com.example.kurullo.dto;

public class BirdTagRequest {

    private Long birdId;          // null when custom
    private String taggedName;
    private String scientificName;
    private boolean isCustom;

    public Long getBirdId() { return birdId; }
    public void setBirdId(Long birdId) { this.birdId = birdId; }

    public String getTaggedName() { return taggedName; }
    public void setTaggedName(String taggedName) { this.taggedName = taggedName; }

    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }

    public boolean isCustom() { return isCustom; }
    public void setCustom(boolean custom) { isCustom = custom; }
}