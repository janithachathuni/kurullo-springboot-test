// dto/PostResponse.java
package com.example.kurullo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {
    private Long id;
    private String description;
    private String locationName;
    private LocalDateTime createdAt;
    private CommentAuthorResponse author;   // reuse the DTO from CommentService
    private List<PostPhotoResponse> photos;
    private long likesCount;
    private boolean likedByCurrentUser;
    private long commentsCount;

    public PostResponse(Long id, String description, String locationName, LocalDateTime createdAt,
                         CommentAuthorResponse author, List<PostPhotoResponse> photos,
                         long likesCount, boolean likedByCurrentUser, long commentsCount) {
        this.id = id;
        this.description = description;
        this.locationName = locationName;
        this.createdAt = createdAt;
        this.author = author;
        this.photos = photos;
        this.likesCount = likesCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.commentsCount = commentsCount;
    }

    public Long getId() { return id; }
    public String getDescription() { return description; }
    public String getLocationName() { return locationName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public CommentAuthorResponse getAuthor() { return author; }
    public List<PostPhotoResponse> getPhotos() { return photos; }
    public long getLikesCount() { return likesCount; }
    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public long getCommentsCount() { return commentsCount; }
}