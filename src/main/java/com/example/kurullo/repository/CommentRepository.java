// repository/CommentRepository.java
package com.example.kurullo.repository;

import com.example.kurullo.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(Long postId);

    long countByPostId(Long postId);
}