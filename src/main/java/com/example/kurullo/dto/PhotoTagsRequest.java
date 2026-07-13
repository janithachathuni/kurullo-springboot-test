// dto/PhotoTagsRequest.java
package com.example.kurullo.dto;

import java.util.List;

public class PhotoTagsRequest {

    private List<BirdTagRequest> birds;

    public List<BirdTagRequest> getBirds() { return birds; }
    public void setBirds(List<BirdTagRequest> birds) { this.birds = birds; }
}