// repository/CommentLikeRepository.java
package com.example.kurullo.repository;

import com.example.kurullo.model.CommentLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {
    Optional<CommentLike> findByCommentIdAndUserId(Long commentId, Long userId);
    long countByCommentId(Long commentId);

    @Transactional
    void deleteByCommentIdAndUserId(Long commentId, Long userId);
}