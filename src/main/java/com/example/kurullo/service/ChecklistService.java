package com.example.kurullo.service;

import com.example.kurullo.dto.*;
import com.example.kurullo.model.Bird;
import com.example.kurullo.model.Checklist;
import com.example.kurullo.model.ChecklistEntry;
import com.example.kurullo.model.ChecklistNote;
import com.example.kurullo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ChecklistService {

    private final ChecklistRepository checklistRepository;
    private final ChecklistEntryRepository checklistEntryRepository;
    private final ChecklistNoteRepository checklistNoteRepository;
    private final BirdRepository birdRepository;

    public ChecklistService(ChecklistRepository checklistRepository,
                             ChecklistEntryRepository checklistEntryRepository,
                             ChecklistNoteRepository checklistNoteRepository,
                             BirdRepository birdRepository) {
        this.checklistRepository = checklistRepository;
        this.checklistEntryRepository = checklistEntryRepository;
        this.checklistNoteRepository = checklistNoteRepository;
        this.birdRepository = birdRepository;
    }

    @Transactional
    public Checklist createChecklist(Long userId, CreateChecklistRequest request) {
        Checklist checklist = new Checklist();
        checklist.setUserId(userId);
        checklist.setTripId(request.getTripId()); // may be null — standalone checklist
        checklist.setTitle(request.getTitle());
        return checklistRepository.save(checklist);
    }

    public List<Checklist> getChecklistsByUser(Long userId) {
        return checklistRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Checklist> getChecklistsByTrip(Long tripId, Long userId) {
        return checklistRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .filter(c -> Objects.equals(c.getUserId(), userId))
                .collect(Collectors.toList());
    }

    public Checklist getChecklistById(Long checklistId) {
        return checklistRepository.findById(checklistId)
                .orElseThrow(() -> new IllegalArgumentException("Checklist not found with id: " + checklistId));
    }

    private void checkOwnership(Checklist checklist, Long userId) {
        if (!Objects.equals(checklist.getUserId(), userId)) {
            throw new SecurityException("You are not allowed to access this checklist");
        }
    }

    public Checklist getOwnedChecklist(Long checklistId, Long userId) {
        Checklist checklist = getChecklistById(checklistId);
        checkOwnership(checklist, userId);
        return checklist;
    }

    @Transactional
    public void deleteChecklist(Long checklistId, Long userId) {
        Checklist checklist = getOwnedChecklist(checklistId, userId);
        checklistRepository.delete(checklist);
    }

    // ---- Entries (bird + count) ----

    @Transactional
    public ChecklistEntry addEntry(Long checklistId, Long userId, AddChecklistEntryRequest request) {
        Checklist checklist = getOwnedChecklist(checklistId, userId);

        Bird bird = birdRepository.findById(request.getBirdId())
                .orElseThrow(() -> new IllegalArgumentException("Bird not found with id: " + request.getBirdId()));

        ChecklistEntry entry = new ChecklistEntry();
        entry.setChecklist(checklist);
        entry.setBird(bird);
        entry.setCount(request.getCount());
        return checklistEntryRepository.save(entry);
    }

    public List<ChecklistEntry> getEntries(Long checklistId, Long userId) {
        getOwnedChecklist(checklistId, userId); // ownership check
        return checklistEntryRepository.findByChecklistId(checklistId);
    }

    @Transactional
    public ChecklistEntry updateEntry(Long checklistId, Long entryId, Long userId, AddChecklistEntryRequest request) {
        getOwnedChecklist(checklistId, userId); // ownership check

        ChecklistEntry entry = checklistEntryRepository.findByIdAndChecklistId(entryId, checklistId)
                .orElseThrow(() -> new IllegalArgumentException("Entry not found with id: " + entryId));

        if (request.getBirdId() != null && !request.getBirdId().equals(entry.getBird().getId())) {
            Bird bird = birdRepository.findById(request.getBirdId())
                    .orElseThrow(() -> new IllegalArgumentException("Bird not found with id: " + request.getBirdId()));
            entry.setBird(bird);
        }
        entry.setCount(request.getCount());
        return checklistEntryRepository.save(entry);
    }

    @Transactional
    public void deleteEntry(Long checklistId, Long entryId, Long userId) {
        getOwnedChecklist(checklistId, userId); // ownership check
        checklistEntryRepository.deleteByIdAndChecklistId(entryId, checklistId);
    }

    // ---- Notes (journal-style, like TripNote) ----

    @Transactional
    public ChecklistNote addNote(Long checklistId, Long userId, CreateChecklistNoteRequest request) {
        Checklist checklist = getOwnedChecklist(checklistId, userId);

        ChecklistNote note = new ChecklistNote();
        note.setChecklist(checklist);
        note.setContent(request.getContent());
        return checklistNoteRepository.save(note);
    }

    public List<ChecklistNote> getNotes(Long checklistId, Long userId) {
        getOwnedChecklist(checklistId, userId); // ownership check
        return checklistNoteRepository.findByChecklistIdOrderByCreatedAtDesc(checklistId);
    }

    @Transactional
    public ChecklistNote updateNote(Long checklistId, Long noteId, Long userId, CreateChecklistNoteRequest request) {
        getOwnedChecklist(checklistId, userId); // ownership check

        ChecklistNote note = checklistNoteRepository.findByIdAndChecklistId(noteId, checklistId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));

        note.setContent(request.getContent());
        note.setUpdatedAt(LocalDateTime.now());
        return checklistNoteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long checklistId, Long noteId, Long userId) {
        getOwnedChecklist(checklistId, userId); // ownership check
        checklistNoteRepository.deleteByIdAndChecklistId(noteId, checklistId);
    }

    // ---- Mappers ----

    public ChecklistResponse mapToResponse(Checklist checklist) {
        List<ChecklistEntry> entries = checklistEntryRepository.findByChecklistId(checklist.getId());
        long totalBirdCount = entries.stream().mapToLong(ChecklistEntry::getCount).sum();
        int speciesCount = entries.size();
        long notesCount = checklistNoteRepository.findByChecklistIdOrderByCreatedAtDesc(checklist.getId()).size();

        return new ChecklistResponse(
                checklist.getId(),
                checklist.getTitle(),
                checklist.getTripId(),
                checklist.getCreatedAt(),
                totalBirdCount,
                speciesCount,
                notesCount
        );
    }

    public List<ChecklistResponse> mapToResponseList(List<Checklist> checklists) {
        return checklists.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ChecklistEntryResponse mapEntryToResponse(ChecklistEntry entry) {
        Bird bird = entry.getBird();
        return new ChecklistEntryResponse(
                entry.getId(),
                bird.getId(),
                bird.getPrimaryName(),
                bird.getScientificName(),
                entry.getCount()
        );
    }

    public List<ChecklistEntryResponse> mapEntryToResponseList(List<ChecklistEntry> entries) {
        return entries.stream().map(this::mapEntryToResponse).collect(Collectors.toList());
    }

    public ChecklistNoteResponse mapNoteToResponse(ChecklistNote note) {
        return new ChecklistNoteResponse(
                note.getId(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }

    public List<ChecklistNoteResponse> mapNoteToResponseList(List<ChecklistNote> notes) {
        return notes.stream().map(this::mapNoteToResponse).collect(Collectors.toList());
    }
}