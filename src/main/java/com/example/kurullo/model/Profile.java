package com.example.kurullo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "profiles")
@Data
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String displayName;
    private String profilePic;
    private String bannerPic;

    @Column(length = 500)
    private String bio;

    @ElementCollection
    @CollectionTable(name = "profile_followers", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "follower_id")
    private List<Long> followers;

    @ElementCollection
    @CollectionTable(name = "profile_following", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "following_id")
    private List<Long> following;

    @ElementCollection
    @CollectionTable(name = "profile_blocked", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "blocked_id")
    private List<Long> blocked;
}