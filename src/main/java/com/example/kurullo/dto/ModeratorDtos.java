package com.example.kurullo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ModeratorDtos {

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ModeratorView {
        private Long userId;
        private String username;
        private String profilePic;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class UserSearchResult {
        private Long userId;
        private String username;
        private String profilePic;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class InviteRequest {
        private Long userId;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ConfirmedNotice {
        private Long inviteId;
        private String username;
    }
}