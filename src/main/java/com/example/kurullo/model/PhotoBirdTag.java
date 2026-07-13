// model/PhotoBirdTag.java
package com.example.kurullo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "photo_bird_tags")
public class PhotoBirdTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private PostPhoto photo;

    // Nullable on purpose — custom/free-text tags have no linked bird
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bird_id")
    private Bird bird;

    @Column(name = "tagged_name", nullable = false)
    private String taggedName;

    @Column(name = "scientific_name")
    private String scientificName;

    @Column(name = "is_custom", nullable = false)
    private boolean isCustom;

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PostPhoto getPhoto() { return photo; }
    public void setPhoto(PostPhoto photo) { this.photo = photo; }

    public Bird getBird() { return bird; }
    public void setBird(Bird bird) { this.bird = bird; }

    public String getTaggedName() { return taggedName; }
    public void setTaggedName(String taggedName) { this.taggedName = taggedName; }

    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }

    public boolean isCustom() { return isCustom; }
    public void setCustom(boolean custom) { isCustom = custom; }
}