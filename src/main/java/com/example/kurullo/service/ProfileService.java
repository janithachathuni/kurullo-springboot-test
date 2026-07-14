package com.example.kurullo.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.kurullo.model.Block;
import com.example.kurullo.model.Follow;
import com.example.kurullo.model.NotificationType;
import com.example.kurullo.model.Profile;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.BlockRepository;
import com.example.kurullo.repository.FollowRepository;
import com.example.kurullo.repository.ProfileRepository;
import com.example.kurullo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final BlockRepository blockRepository;
    private final NotificationService notificationService;   // <-- add this
    private final Cloudinary cloudinary;

    public Profile completeProfile(String email, String displayName, String bio,
                                   MultipartFile profilePic, MultipartFile bannerPic) throws IOException {
        // unchanged
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElse(new Profile());

        profile.setUser(user);
        profile.setDisplayName(displayName);
        profile.setBio(bio);

        if (profilePic != null && !profilePic.isEmpty()) {
            profile.setProfilePic(uploadToCloudinary(profilePic, "profile-pics", 400, 400, "face"));
        }

        if (bannerPic != null && !bannerPic.isEmpty()) {
            profile.setBannerPic(uploadToCloudinary(bannerPic, "banners", 1200, 400, "auto"));
        }

        profileRepository.save(profile);

        user.setFirstLogin(false);
        user.setProfileCompleted(true);
        userRepository.save(user);

        return profile;
    }

    public Profile updateProfile(String email, String displayName, String bio,
                                MultipartFile profilePic, MultipartFile bannerPic) throws IOException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (displayName != null) profile.setDisplayName(displayName);
        if (bio != null) profile.setBio(bio);

        if (profilePic != null && !profilePic.isEmpty()) {
            profile.setProfilePic(uploadToCloudinary(profilePic, "profile-pics", 400, 400, "face"));
        }

        if (bannerPic != null && !bannerPic.isEmpty()) {
            profile.setBannerPic(uploadToCloudinary(bannerPic, "banners", 1200, 400, "auto"));
        }

        profileRepository.save(profile);

        return profile;
    }

    private String uploadToCloudinary(MultipartFile file, String folder, int width, int height, String gravity) throws IOException {
        com.cloudinary.Transformation transformation = new com.cloudinary.Transformation()
                .width(width)
                .height(height)
                .crop("fill")
                .gravity(gravity);

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "kurullo/" + folder,
                    "transformation", transformation
                ));
        return (String) uploadResult.get("secure_url");
    }

    public Map<String, Object> getProfileByUsername(String username, String viewerEmail) {
        // unchanged
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.getId());  
        result.put("username", user.getUsername());
        result.put("displayName", profile.getDisplayName());
        result.put("bio", profile.getBio());
        result.put("profilePic", profile.getProfilePic());
        result.put("bannerPic", profile.getBannerPic());
        result.put("followers", followRepository.countByFollowingId(user.getId()));
        result.put("following", followRepository.countByFollowerId(user.getId()));

        boolean isFollowing = false;
        boolean isBlocked = false;
        boolean blockedByThem = false;

        if (viewerEmail != null) {
            User viewer = userRepository.findByEmail(viewerEmail).orElse(null);
            if (viewer != null && !viewer.getId().equals(user.getId())) {
                isFollowing = followRepository.existsByFollowerIdAndFollowingId(viewer.getId(), user.getId());
                isBlocked = blockRepository.existsByBlockerIdAndBlockedId(viewer.getId(), user.getId());
                blockedByThem = blockRepository.existsByBlockerIdAndBlockedId(user.getId(), viewer.getId());
            }
        }

        result.put("isFollowing", isFollowing);
        result.put("isBlocked", isBlocked);
        result.put("blockedByThem", blockedByThem);

        return result;
    }

    @Transactional
    public void follow(String followerEmail, String targetUsername) {
        User follower = userRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (follower.getId().equals(target.getId())) {
            throw new RuntimeException("You cannot follow yourself");
        }

        if (blockRepository.existsByBlockerIdAndBlockedId(target.getId(), follower.getId())) {
            throw new RuntimeException("You cannot follow this user");
        }

        if (!followRepository.existsByFollowerIdAndFollowingId(follower.getId(), target.getId())) {
            Follow f = new Follow();
            f.setFollowerId(follower.getId());
            f.setFollowingId(target.getId());
            followRepository.save(f);

            notificationService.create(
                target.getId(), follower.getId(), NotificationType.FOLLOW,
                "USER", follower.getId(),
                follower.getUsername() + " started following you"
            );
        }
    }

    @Transactional
    public void unfollow(String followerEmail, String targetUsername) {
        User follower = userRepository.findByEmail(followerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        followRepository.deleteByFollowerIdAndFollowingId(follower.getId(), target.getId());
    }

    @Transactional
    public void block(String blockerEmail, String targetUsername) {
        User blocker = userRepository.findByEmail(blockerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (blocker.getId().equals(target.getId())) {
            throw new RuntimeException("You cannot block yourself");
        }

        if (!blockRepository.existsByBlockerIdAndBlockedId(blocker.getId(), target.getId())) {
            Block b = new Block();
            b.setBlockerId(blocker.getId());
            b.setBlockedId(target.getId());
            blockRepository.save(b);
        }

        followRepository.deleteByFollowerIdAndFollowingId(blocker.getId(), target.getId());
        followRepository.deleteByFollowerIdAndFollowingId(target.getId(), blocker.getId());
    }

    @Transactional
    public void unblock(String blockerEmail, String targetUsername) {
        User blocker = userRepository.findByEmail(blockerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User target = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        blockRepository.deleteByBlockerIdAndBlockedId(blocker.getId(), target.getId());
    }

    
}