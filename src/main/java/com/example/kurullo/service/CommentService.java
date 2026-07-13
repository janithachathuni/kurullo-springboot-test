// service/CommentService.java
package com.example.kurullo.service;

import com.example.kurullo.dto.CommentAuthorResponse;
import com.example.kurullo.dto.CommentResponse;
import com.example.kurullo.model.Comment;
import com.example.kurullo.model.CommentLike;
import com.example.kurullo.model.Post;
import com.example.kurullo.model.Profile;
import com.example.kurullo.model.User;
import com.example.kurullo.repository.CommentLikeRepository;
import com.example.kurullo.repository.CommentRepository;
import com.example.kurullo.repository.PostRepository;
import com.example.kurullo.repository.ProfileRepository;
import com.example.kurullo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public CommentService(CommentRepository commentRepository,
                           CommentLikeRepository commentLikeRepository,
                           PostRepository postRepository,
                           UserRepository userRepository,
                           ProfileRepository profileRepository) {
        this.commentRepository = commentRepository;
        this.commentLikeRepository = commentLikeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Comment addComment(Long postId, Long userId, String content, Long parentCommentId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUserId(userId);
        comment.setContent(content);

        if (parentCommentId != null) {
            Comment parent = commentRepository.findById(parentCommentId)
                    .orElseThrow(() -> new IllegalArgumentException("Parent comment not found with id: " + parentCommentId));
            comment.setParentComment(parent);
        }

        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long requestingUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        if (!comment.getUserId().equals(requestingUserId)) {
            throw new SecurityException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public boolean toggleCommentLike(Long commentId, Long userId) {
        var existing = commentLikeRepository.findByCommentIdAndUserId(commentId, userId);

        if (existing.isPresent()) {
            commentLikeRepository.deleteByCommentIdAndUserId(commentId, userId);
            return false;
        } else {
            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));
            CommentLike like = new CommentLike();
            like.setComment(comment);
            like.setUserId(userId);
            commentLikeRepository.save(like);
            return true;
        }
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsForPost(Long postId, Long currentUserId) {
        List<Comment> topLevel = commentRepository.findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(postId);
        return topLevel.stream()
                .map(c -> mapToResponse(c, currentUserId))
                .collect(Collectors.toList());
    }

    private CommentResponse mapToResponse(Comment comment, Long currentUserId) {
        CommentAuthorResponse author = buildAuthor(comment.getUserId());

        long likesCount = commentLikeRepository.countByCommentId(comment.getId());
        boolean likedByCurrentUser = currentUserId != null
                && commentLikeRepository.findByCommentIdAndUserId(comment.getId(), currentUserId).isPresent();

        List<CommentResponse> replies = comment.getReplies().stream()
                .map(r -> mapToResponse(r, currentUserId))
                .collect(Collectors.toList());

        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                author,
                likesCount,
                likedByCurrentUser,
                replies
        );
    }

    private CommentAuthorResponse buildAuthor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        Profile profile = profileRepository.findByUserId(userId).orElse(null);

        String displayName = profile != null ? profile.getDisplayName() : user.getUsername();
        String profilePic = profile != null ? profile.getProfilePic() : null;

        return new CommentAuthorResponse(user.getId(), user.getUsername(), displayName, profilePic);
    }
}