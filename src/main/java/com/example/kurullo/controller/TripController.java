package com.example.kurullo.controller;

import com.example.kurullo.dto.CreateNoteRequest;
import com.example.kurullo.dto.CreateTripRequest;
import com.example.kurullo.dto.TripLocationResponse;
import com.example.kurullo.dto.TripNoteResponse;
import com.example.kurullo.dto.TripResponse;
import com.example.kurullo.dto.TripStatsResponse;
import com.example.kurullo.model.Trip;
import com.example.kurullo.model.TripNote;
import com.example.kurullo.repository.UserRepository;
import com.example.kurullo.security.JwtUtil;
import com.example.kurullo.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    @Autowired
    private TripService tripService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateTripRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        Trip trip = tripService.createTrip(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.mapToResponse(trip));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getMyTrips(
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        List<Trip> trips = tripService.getTripsByUser(userId);
        return ResponseEntity.ok(tripService.mapToResponseList(trips));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripResponse> getTrip(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        Trip trip = tripService.getOwnedTrip(tripId, userId);
        return ResponseEntity.ok(tripService.mapToResponse(trip));
    }

    @DeleteMapping("/{tripId}")
    public ResponseEntity<?> deleteTrip(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        tripService.deleteTrip(tripId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/locations")
public ResponseEntity<List<TripLocationResponse>> getMyTripLocations(
        @RequestParam(required = false) Integer year,
        @RequestHeader("Authorization") String authHeader
) {
    Long userId = resolveUserId(authHeader);
    List<Trip> trips = tripService.getTripsByUserFiltered(userId, year);
    return ResponseEntity.ok(tripService.mapToLocationResponseList(trips));
}

@GetMapping("/stats")
public ResponseEntity<TripStatsResponse> getMyTripStats(
        @RequestHeader("Authorization") String authHeader
) {
    Long userId = resolveUserId(authHeader);
    return ResponseEntity.ok(tripService.getStats(userId));
}


    @PostMapping("/{tripId}/notes")
    public ResponseEntity<TripNoteResponse> addNote(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateNoteRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        TripNote note = tripService.addNote(tripId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tripService.mapNoteToResponse(note));
    }

    @GetMapping("/{tripId}/notes")
    public ResponseEntity<List<TripNoteResponse>> getNotes(
            @PathVariable Long tripId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        List<TripNote> notes = tripService.getNotes(tripId, userId);
        return ResponseEntity.ok(tripService.mapNoteToResponseList(notes));
    }

    @PutMapping("/{tripId}/notes/{noteId}")
    public ResponseEntity<TripNoteResponse> updateNote(
            @PathVariable Long tripId,
            @PathVariable Long noteId,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateNoteRequest request
    ) {
        Long userId = resolveUserId(authHeader);
        TripNote note = tripService.updateNote(tripId, noteId, userId, request);
        return ResponseEntity.ok(tripService.mapNoteToResponse(note));
    }

    @DeleteMapping("/{tripId}/notes/{noteId}")
    public ResponseEntity<?> deleteNote(
            @PathVariable Long tripId,
            @PathVariable Long noteId,
            @RequestHeader("Authorization") String authHeader
    ) {
        Long userId = resolveUserId(authHeader);
        tripService.deleteNote(tripId, noteId, userId);
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