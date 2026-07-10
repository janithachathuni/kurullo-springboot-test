package com.example.kurullo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "birds")
public class Bird {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String primaryName;

    @Column(nullable = false, unique = true)
    private String scientificName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String sinhalaName;
    private String tamilName;

    @Column(nullable = false)
    private String imageUrl;

    private String habitatMapUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Frequency frequency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Residency residency;

    @Column(nullable = false)
    private boolean endemic = false;

    private String habitat;

    @Column(columnDefinition = "TEXT")
    private String places; // free-text sentence

    @Enumerated(EnumType.STRING)
    @Column(name = "bird_order", nullable = false)
    private BirdOrder order;

    @Enumerated(EnumType.STRING)
    @Column(name = "bird_family", nullable = false)
    private BirdFamily family;

    @ElementCollection
    @CollectionTable(name = "bird_other_names", joinColumns = @JoinColumn(name = "bird_id"))
    @Column(name = "name")
    @OrderColumn(name = "position")
    private List<String> otherNames = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "bird_notes", joinColumns = @JoinColumn(name = "bird_id"))
    @Column(name = "note", columnDefinition = "TEXT")
    @OrderColumn(name = "position")
    private List<String> notes = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPrimaryName() { return primaryName; }
    public void setPrimaryName(String primaryName) { this.primaryName = primaryName; }
    public String getScientificName() { return scientificName; }
    public void setScientificName(String scientificName) { this.scientificName = scientificName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSinhalaName() { return sinhalaName; }
    public void setSinhalaName(String sinhalaName) { this.sinhalaName = sinhalaName; }
    public String getTamilName() { return tamilName; }
    public void setTamilName(String tamilName) { this.tamilName = tamilName; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getHabitatMapUrl() { return habitatMapUrl; }
    public void setHabitatMapUrl(String habitatMapUrl) { this.habitatMapUrl = habitatMapUrl; }
    public Frequency getFrequency() { return frequency; }
    public void setFrequency(Frequency frequency) { this.frequency = frequency; }
    public Residency getResidency() { return residency; }
    public void setResidency(Residency residency) { this.residency = residency; }
    public boolean isEndemic() { return endemic; }
    public void setEndemic(boolean endemic) { this.endemic = endemic; }
    public String getHabitat() { return habitat; }
    public void setHabitat(String habitat) { this.habitat = habitat; }
    public String getPlaces() { return places; }
    public void setPlaces(String places) { this.places = places; }
    public BirdOrder getOrder() { return order; }
    public void setOrder(BirdOrder order) { this.order = order; }
    public BirdFamily getFamily() { return family; }
    public void setFamily(BirdFamily family) { this.family = family; }
    public List<String> getOtherNames() { return otherNames; }
    public void setOtherNames(List<String> otherNames) { this.otherNames = otherNames; }
    public List<String> getNotes() { return notes; }
    public void setNotes(List<String> notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}