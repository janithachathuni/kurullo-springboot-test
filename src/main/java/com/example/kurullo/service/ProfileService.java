package com.example.kurullo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.kurullo.model.Profile;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.ProfileRepository;
import com.example.kurullo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    public Profile completeProfile(String email, String displayName, String bio,
                                   MultipartFile profilePic, MultipartFile bannerPic) throws IOException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElse(new Profile());

        profile.setUser(user);
        profile.setDisplayName(displayName);
        profile.setBio(bio);

        if (profile.getFollowers() == null) profile.setFollowers(new ArrayList<>());
        if (profile.getFollowing() == null) profile.setFollowing(new ArrayList<>());
        if (profile.getBlocked() == null)   profile.setBlocked(new ArrayList<>());

        if (profilePic != null && !profilePic.isEmpty()) {
            profile.setProfilePic(uploadToCloudinary(profilePic, "profile-pics"));
        }

        if (bannerPic != null && !bannerPic.isEmpty()) {
            profile.setBannerPic(uploadToCloudinary(bannerPic, "banners"));
        }

        profileRepository.save(profile);

        user.setFirstLogin(false);
        user.setProfileCompleted(true);
        userRepository.save(user);

        return profile;
    }

    private String uploadToCloudinary(MultipartFile file, String folder) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("folder", "kurullo/" + folder));
        return (String) uploadResult.get("secure_url");
    }

    public Map<String, Object> getProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("username", user.getUsername());
        result.put("displayName", profile.getDisplayName());
        result.put("bio", profile.getBio());
        result.put("profilePic", profile.getProfilePic());
        result.put("bannerPic", profile.getBannerPic());
        result.put("followers", profile.getFollowers() != null ? profile.getFollowers().size() : 0);
        result.put("following", profile.getFollowing() != null ? profile.getFollowing().size() : 0);
        return result;
    }
}