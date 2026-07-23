package com.example.kurullo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kurullo.dto.AddChecklistEntryRequest;
import com.example.kurullo.dto.ChecklistEntryResponse;
import com.example.kurullo.dto.ChecklistNoteResponse;
import com.example.kurullo.dto.ChecklistResponse;
import com.example.kurullo.dto.CreateChecklistNoteRequest;
import com.example.kurullo.dto.CreateChecklistRequest;
import com.example.kurullo.model.Checklist;
import com.example.kurullo.model.ChecklistEntry;
import com.example.kurullo.model.ChecklistNote;
import com.example.kurullo.repository.UserRepository;
import com.example.kurullo.security.JwtUtil;
import com.example.kurullo.service.ChecklistService;

@RestController
@RequestMapping("/api/checklists")
public class ChecklistController {

    @Autowired
    private ChecklistService checklistService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ChecklistResponse> createChecklist(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateChecklistRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        Checklist checklist = checklistService.createChecklist(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(checklistService.mapToResponse(checklist));
    }

    @GetMapping
    public ResponseEntity<List<ChecklistResponse>> getMyChecklists(
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        List<Checklist> checklists = checklistService.getChecklistsByUser(userId);
        return ResponseEntity.ok(checklistService.mapToResponseList(checklists));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<ChecklistResponse>> getChecklistsByTrip(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        List<Checklist> checklists = checklistService.getChecklistsByTrip(tripId, userId);
        return ResponseEntity.ok(checklistService.mapToResponseList(checklists));
    }

    @GetMapping("/{checklistId}")
    public ResponseEntity<ChecklistResponse> getChecklist(
            @PathVariable Long checklistId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        Checklist checklist = checklistService.getOwnedChecklist(checklistId, userId);
        return ResponseEntity.ok(checklistService.mapToResponse(checklist));
    }

    @DeleteMapping("/{checklistId}")
    public ResponseEntity<?> deleteChecklist(
            @PathVariable Long checklistId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        checklistService.deleteChecklist(checklistId, userId);
        return ResponseEntity.noContent().build();
    }

    // ---- Entries ----

    @PostMapping("/{checklistId}/entries")
    public ResponseEntity<ChecklistEntryResponse> addEntry(
            @PathVariable Long checklistId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AddChecklistEntryRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        ChecklistEntry entry = checklistService.addEntry(checklistId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(checklistService.mapEntryToResponse(entry));
    }

    @GetMapping("/{checklistId}/entries")
    public ResponseEntity<List<ChecklistEntryResponse>> getEntries(
            @PathVariable Long checklistId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        List<ChecklistEntry> entries = checklistService.getEntries(checklistId, userId);
        return ResponseEntity.ok(checklistService.mapEntryToResponseList(entries));
    }

    @PutMapping("/{checklistId}/entries/{entryId}")
    public ResponseEntity<ChecklistEntryResponse> updateEntry(
            @PathVariable Long checklistId,
            @PathVariable Long entryId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody AddChecklistEntryRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        ChecklistEntry entry = checklistService.updateEntry(checklistId, entryId, userId, request);
        return ResponseEntity.ok(checklistService.mapEntryToResponse(entry));
    }

    @DeleteMapping("/{checklistId}/entries/{entryId}")
    public ResponseEntity<?> deleteEntry(
            @PathVariable Long checklistId,
            @PathVariable Long entryId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        checklistService.deleteEntry(checklistId, entryId, userId);
        return ResponseEntity.noContent().build();
    }

    // ---- Notes ----

    @PostMapping("/{checklistId}/notes")
    public ResponseEntity<ChecklistNoteResponse> addNote(
            @PathVariable Long checklistId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateChecklistNoteRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        ChecklistNote note = checklistService.addNote(checklistId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(checklistService.mapNoteToResponse(note));
    }

    @GetMapping("/{checklistId}/notes")
    public ResponseEntity<List<ChecklistNoteResponse>> getNotes(
            @PathVariable Long checklistId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        List<ChecklistNote> notes = checklistService.getNotes(checklistId, userId);
        return ResponseEntity.ok(checklistService.mapNoteToResponseList(notes));
    }

    @PutMapping("/{checklistId}/notes/{noteId}")
    public ResponseEntity<ChecklistNoteResponse> updateNote(
            @PathVariable Long checklistId,
            @PathVariable Long noteId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateChecklistNoteRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        ChecklistNote note = checklistService.updateNote(checklistId, noteId, userId, request);
        return ResponseEntity.ok(checklistService.mapNoteToResponse(note));
    }

    @DeleteMapping("/{checklistId}/notes/{noteId}")
    public ResponseEntity<?> deleteNote(
            @PathVariable Long checklistId,
            @PathVariable Long noteId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        checklistService.deleteNote(checklistId, noteId, userId);
        return ResponseEntity.noContent().build();
    }

    private Long resolveUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();
    }
}