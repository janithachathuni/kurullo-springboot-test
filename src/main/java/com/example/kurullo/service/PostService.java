// service/PostService.java
package com.example.kurullo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.example.kurullo.dto.*;
import com.example.kurullo.model.*;
import com.example.kurullo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final BirdRepository birdRepository;
    private final PostPhotoRepository postPhotoRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final Cloudinary cloudinary;

    public PostService(PostRepository postRepository,
                       BirdRepository birdRepository,
                       Cloudinary cloudinary,
                       PostPhotoRepository postPhotoRepository,
                       PostLikeRepository postLikeRepository,
                       CommentRepository commentRepository,
                       UserRepository userRepository,
                       ProfileRepository profileRepository) {
        this.postRepository = postRepository;
        this.birdRepository = birdRepository;
        this.cloudinary = cloudinary;
        this.postPhotoRepository = postPhotoRepository;
        this.postLikeRepository = postLikeRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Post createPost(Long userId, CreatePostRequest request, MultipartFile[] images) {
        if (images == null || images.length == 0) {
            throw new IllegalArgumentException("At least one photo is required");
        }

        Post post = new Post();
        post.setUserId(userId);
        post.setDescription(request.getDescription());
        post.setLocationName(request.getLocationName());
        post.setFormattedAddress(request.getFormattedAddress());
        post.setLatitude(request.getLatitude());
        post.setLongitude(request.getLongitude());
        post.setPlaceId(request.getPlaceId());
        post.setCity(request.getCity());
        post.setState(request.getState());
        post.setCountry(request.getCountry());

        List<PhotoTagsRequest> photoTagLists = request.getPhotos();

        for (int i = 0; i < images.length; i++) {
            MultipartFile file = images[i];

            Map uploadResult = uploadPhotoToCloudinary(file);

            PostPhoto photo = new PostPhoto();
            photo.setPost(post);
            photo.setImageUrl((String) uploadResult.get("secure_url"));
            photo.setCloudinaryPublicId((String) uploadResult.get("public_id"));
            photo.setDisplayOrder(i);

            if (photoTagLists != null && i < photoTagLists.size()
                    && photoTagLists.get(i).getBirds() != null) {
                for (BirdTagRequest tagReq : photoTagLists.get(i).getBirds()) {
                    PhotoBirdTag tag = new PhotoBirdTag();
                    tag.setPhoto(photo);
                    tag.setCustom(tagReq.isCustom());
                    tag.setTaggedName(tagReq.getTaggedName());
                    tag.setScientificName(tagReq.getScientificName());

                    if (!tagReq.isCustom() && tagReq.getBirdId() != null) {
                        Bird bird = birdRepository.findById(tagReq.getBirdId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                        "Bird not found with id: " + tagReq.getBirdId()));
                        tag.setBird(bird);
                    }

                    photo.getBirdTags().add(tag);
                }
            }

            post.getPhotos().add(photo);
        }

        return postRepository.save(post);
    }

    private Map uploadPhotoToCloudinary(MultipartFile file) {
        try {
            return cloudinary.uploader().upload(file.getBytes(), Map.of(
                    "transformation", new Transformation()
                            .width(1600)
                            .crop("limit")
                            .quality("auto")
            ));
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload photo to Cloudinary", e);
        }
    }

    public Page<Post> getFeed(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Post> getPostsByUser(Long userId, Pageable pageable) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
    }

    @Transactional
    public void deletePost(Long postId, Long requestingUserId) {
        Post post = getPostById(postId);
        if (!Objects.equals(post.getUserId(), requestingUserId)) {
            throw new SecurityException("You are not allowed to delete this post");
        }
        postRepository.delete(post);
    }

    @Transactional
    public boolean togglePostLike(Long postId, Long userId) {
        var existing = postLikeRepository.findByPostIdAndUserId(postId, userId);

        if (existing.isPresent()) {
            postLikeRepository.deleteByPostIdAndUserId(postId, userId);
            return false;
        } else {
            Post post = getPostById(postId);
            PostLike like = new PostLike();
            like.setPost(post);
            like.setUserId(userId);
            postLikeRepository.save(like);
            return true;
        }
    }

    @Transactional
    public void setPhotoFeatured(Long photoId, boolean featured) {
        PostPhoto photo = postPhotoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with id: " + photoId));
        photo.setFeatured(featured);
        postPhotoRepository.save(photo);
    }

    public long getLikesCount(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }

    public boolean isLikedByUser(Long postId, Long userId) {
        return postLikeRepository.findByPostIdAndUserId(postId, userId).isPresent();
    }

    // Mapper method to convert Post to PostResponse
    public PostResponse mapToResponse(Post post, Long currentUserId) {
        User user = userRepository.findById(post.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Profile profile = profileRepository.findByUserId(post.getUserId()).orElse(null);

        CommentAuthorResponse author = new CommentAuthorResponse(
                user.getId(),
                user.getUsername(),
                profile != null ? profile.getDisplayName() : user.getUsername(),
                profile != null ? profile.getProfilePic() : null
        );

        List<PostPhotoResponse> photos = post.getPhotos().stream()
                .map(p -> new PostPhotoResponse(
                        p.getId(),
                        p.getImageUrl(),
                        p.isFeatured(),
                        p.getBirdTags().stream()
                                .map(PhotoBirdTag::getTaggedName)
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        long likesCount = postLikeRepository.countByPostId(post.getId());
        boolean liked = currentUserId != null && isLikedByUser(post.getId(), currentUserId);
        long commentsCount = commentRepository.countByPostId(post.getId());

        return new PostResponse(
                post.getId(),
                post.getDescription(),
                post.getLocationName(),
                post.getCreatedAt(),
                author,
                photos,
                likesCount,
                liked,
                commentsCount
        );
    }

    // Helper method to map multiple posts
    public List<PostResponse> mapToResponseList(List<Post> posts, Long currentUserId) {
        return posts.stream()
                .map(post -> mapToResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    // Helper method to map Page of posts
    public Page<PostResponse> mapToResponsePage(Page<Post> posts, Long currentUserId) {
        return posts.map(post -> mapToResponse(post, currentUserId));
    }
}