// controller/PostController.java
package com.example.kurullo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.kurullo.dto.CreatePostRequest;
import com.example.kurullo.dto.PostResponse;
import com.example.kurullo.model.Post;
import com.example.kurullo.repository.UserRepository;
import com.example.kurullo.security.JwtUtil;
import com.example.kurullo.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createPost(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart("post") CreatePostRequest request,
            @RequestPart("images") MultipartFile[] images
    ) {
        Long userId = resolveUserId(authHeader);
        Post post = postService.createPost(userId, request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.mapToResponse(post, userId));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long currentUserId = resolveUserIdOrNull(authHeader);
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postService.getFeed(pageable);
        return ResponseEntity.ok(postService.mapToResponsePage(posts, currentUserId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<PostResponse>> getPostsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long currentUserId = resolveUserIdOrNull(authHeader);
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postService.getPostsByUser(userId, pageable);
        return ResponseEntity.ok(postService.mapToResponsePage(posts, currentUserId));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable Long postId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long currentUserId = resolveUserIdOrNull(authHeader);
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(postService.mapToResponse(post, currentUserId));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> togglePostLike(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        boolean liked = postService.togglePostLike(postId, userId);
        return ResponseEntity.ok(liked);
    }

    private Long resolveUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();
    }

    private Long resolveUserIdOrNull(String authHeader) {
        if (authHeader == null) return null;
        try {
            return resolveUserId(authHeader);
        } catch (Exception e) {
            return null;
        }
    }
}