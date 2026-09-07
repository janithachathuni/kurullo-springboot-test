// dto/PostPhotoResponse.java
package com.example.kurullo.dto;

import java.util.List;

public class PostPhotoResponse {
    private Long id;
    private String imageUrl;
    private boolean featured;
    private List<BirdTagResponse> birdTags; // id + display name per tagged bird

    public PostPhotoResponse(Long id, String imageUrl, boolean featured, List<BirdTagResponse> birdTags) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.featured = featured;
        this.birdTags = birdTags;
    }

    public Long getId() { return id; }
    public String getImageUrl() { return imageUrl; }
    public boolean isFeatured() { return featured; }
    public List<BirdTagResponse> getBirdTags() { return birdTags; }
}