package com.example.kurullo.service;

import com.example.kurullo.model.Profile;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.ProfileRepository;
import com.example.kurullo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    private static final String UPLOAD_DIR = "uploads/profiles/";

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
            String picPath = saveFile(profilePic, "profilePic");
            profile.setProfilePic(picPath);
        }

        if (bannerPic != null && !bannerPic.isEmpty()) {
            String bannerPath = saveFile(bannerPic, "bannerPic");
            profile.setBannerPic(bannerPath);
        }

        profileRepository.save(profile);

        user.setFirstLogin(false);
        user.setProfileCompleted(true);
        userRepository.save(user);

        return profile;
    }

    private String saveFile(MultipartFile file, String prefix) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String filename = prefix + "-" + System.currentTimeMillis() + "-" +
                          file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
        Path path = Paths.get(UPLOAD_DIR + filename);
        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        return UPLOAD_DIR + filename;
    }
}