// controller/CommentController.java
package com.example.kurullo.controller;

import com.example.kurullo.dto.CommentResponse;
import com.example.kurullo.dto.CreateCommentRequest;
import com.example.kurullo.model.Comment;
import com.example.kurullo.repository.UserRepository;
import com.example.kurullo.security.JwtUtil;
import com.example.kurullo.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(
            @PathVariable Long postId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        Long currentUserId = resolveUserIdOrNull(authHeader);
        return ResponseEntity.ok(commentService.getCommentsForPost(postId, currentUserId));
    }

    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateCommentRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        Comment comment = commentService.addComment(postId, userId, request.getContent(), request.getParentCommentId());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment.getId());
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<?> toggleCommentLike(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        boolean liked = commentService.toggleCommentLike(commentId, userId);
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