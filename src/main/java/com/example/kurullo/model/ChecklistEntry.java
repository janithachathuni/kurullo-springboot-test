package com.example.kurullo.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "checklist_entries")
@Data
public class ChecklistEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checklist_id", nullable = false)
    private Checklist checklist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bird_id", nullable = false)
    private Bird bird;

    private int count;
}