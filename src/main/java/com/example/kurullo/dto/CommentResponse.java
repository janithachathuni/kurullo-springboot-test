// dto/CommentResponse.java
package com.example.kurullo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CommentResponse {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private CommentAuthorResponse author;
    private long likesCount;
    private boolean likedByCurrentUser;
    private List<CommentResponse> replies;

    public CommentResponse(Long id, String content, LocalDateTime createdAt, CommentAuthorResponse author,
                            long likesCount, boolean likedByCurrentUser, List<CommentResponse> replies) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.author = author;
        this.likesCount = likesCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.replies = replies;
    }

    public Long getId() { return id; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public CommentAuthorResponse getAuthor() { return author; }
    public long getLikesCount() { return likesCount; }
    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public List<CommentResponse> getReplies() { return replies; }
}