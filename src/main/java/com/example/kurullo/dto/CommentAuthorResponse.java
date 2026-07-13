// dto/CommentAuthorResponse.java
package com.example.kurullo.dto;

public class CommentAuthorResponse {
    private Long userId;
    private String username;
    private String displayName;
    private String profilePic;

    public CommentAuthorResponse(Long userId, String username, String displayName, String profilePic) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.profilePic = profilePic;
    }

    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getDisplayName() { return displayName; }
    public String getProfilePic() { return profilePic; }
}