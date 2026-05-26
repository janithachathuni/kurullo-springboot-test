package com.example.kurullo.dto;

import lombok.Data;

@Data
public class ProfileRequest {
    private String displayName;
    private String bio;
    // profilePic and bannerPic are handled as MultipartFile in the controller
}