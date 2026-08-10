// dto/CommentAuthorResponse.java
package com.example.kurullo.dto;

public class CommentAuthorResponse {
    private Long userId;
    private String username;
    private String displayName;
    private String profilePic;
    private boolean moderator;

    public CommentAuthorResponse(Long userId, String username, String displayName, String profilePic, boolean moderator) {
        this.userId = userId;
        this.username = username;
        this.displayName = displayName;
        this.profilePic = profilePic;
        this.moderator = moderator;
    }

    public Long getUserId() { return userId; }
    public String getUsername() { return username; }
    public String getDisplayName() { return displayName; }
    public String getProfilePic() { return profilePic; }
    public boolean isModerator() { return moderator; }
}