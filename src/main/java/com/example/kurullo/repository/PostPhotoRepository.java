// repository/PostPhotoRepository.java
package com.example.kurullo.repository;

import com.example.kurullo.model.PostPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PostPhotoRepository extends JpaRepository<PostPhoto, Long> {

    @Query("SELECT DISTINCT pp FROM PostPhoto pp JOIN pp.birdTags bt WHERE bt.bird.id = :birdId ORDER BY pp.id DESC")
    List<PostPhoto> findByBirdId(@Param("birdId") Long birdId);

    @Query("SELECT DISTINCT pp FROM PostPhoto pp JOIN pp.birdTags bt WHERE bt.bird.id = :birdId AND pp.featured = true ORDER BY pp.id DESC")
    List<PostPhoto> findFeaturedByBirdId(@Param("birdId") Long birdId);
}