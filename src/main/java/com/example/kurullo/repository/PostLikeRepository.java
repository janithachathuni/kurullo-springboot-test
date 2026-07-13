// repository/PostLikeRepository.java
package com.example.kurullo.repository;

import com.example.kurullo.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);

    @Transactional
    void deleteByPostIdAndUserId(Long postId, Long userId);
}