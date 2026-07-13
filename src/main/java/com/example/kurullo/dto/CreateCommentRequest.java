// dto/CreateCommentRequest.java
package com.example.kurullo.dto;

public class CreateCommentRequest {
    private String content;
    private Long parentCommentId; // null for top-level comment

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Long getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(Long parentCommentId) { this.parentCommentId = parentCommentId; }
}