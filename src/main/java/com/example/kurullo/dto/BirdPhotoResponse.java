// dto/BirdPhotoResponse.java
package com.example.kurullo.dto;

public class BirdPhotoResponse {
    private Long id;
    private String imageUrl;
    private boolean featured;

    public BirdPhotoResponse(Long id, String imageUrl, boolean featured) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.featured = featured;
    }

    public Long getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public boolean isFeatured() { return featured; }
}