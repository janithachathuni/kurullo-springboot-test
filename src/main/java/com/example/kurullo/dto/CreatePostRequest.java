// dto/CreatePostRequest.java
package com.example.kurullo.dto;

import java.util.List;

public class CreatePostRequest {

    private String description;
    private String locationName;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private String placeId;
    private String city;
    private String state;
    private String country;

    // One entry per photo, in the same order as the uploaded "images" files
    private List<PhotoTagsRequest> photos;

    // Getters and setters

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getFormattedAddress() { return formattedAddress; }
    public void setFormattedAddress(String formattedAddress) { this.formattedAddress = formattedAddress; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public List<PhotoTagsRequest> getPhotos() { return photos; }
    public void setPhotos(List<PhotoTagsRequest> photos) { this.photos = photos; }
}