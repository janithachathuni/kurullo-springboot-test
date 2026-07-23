package com.example.kurullo.service;

import com.example.kurullo.dto.*;
import com.example.kurullo.model.Trip;
import com.example.kurullo.model.TripNote;
import com.example.kurullo.repository.TripNoteRepository;
import com.example.kurullo.repository.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.time.LocalDateTime;


@Service
public class TripService {

    private final TripRepository tripRepository;
    private final TripNoteRepository tripNoteRepository;

    public TripService(TripRepository tripRepository, TripNoteRepository tripNoteRepository) {
        this.tripRepository = tripRepository;
        this.tripNoteRepository = tripNoteRepository;
    }

    @Transactional
    public Trip createTrip(Long userId, CreateTripRequest request) {
        Trip trip = new Trip();
        trip.setUserId(userId);
        trip.setTitle(request.getTitle());
        trip.setLocation(request.getLocation());
        trip.setFormattedAddress(request.getFormattedAddress());
        trip.setLatitude(request.getLatitude());
        trip.setLongitude(request.getLongitude());
        trip.setPlaceId(request.getPlaceId());
        trip.setCity(request.getCity());
        trip.setState(request.getState());
        trip.setCountry(request.getCountry());
        return tripRepository.save(trip);
    }

    public List<Trip> getTripsByUser(Long userId) {
        return tripRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Trip getTripById(Long tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new IllegalArgumentException("Trip not found with id: " + tripId));
    }

    private void checkOwnership(Trip trip, Long userId) {
        if (!Objects.equals(trip.getUserId(), userId)) {
            throw new SecurityException("You are not allowed to access this trip");
        }
    }

    public Trip getOwnedTrip(Long tripId, Long userId) {
        Trip trip = getTripById(tripId);
        checkOwnership(trip, userId);
        return trip;
    }

    @Transactional
    public void deleteTrip(Long tripId, Long userId) {
        Trip trip = getOwnedTrip(tripId, userId);
        tripRepository.delete(trip);
    }

    @Transactional
    public TripNote addNote(Long tripId, Long userId, CreateNoteRequest request) {
        Trip trip = getOwnedTrip(tripId, userId);

        TripNote note = new TripNote();
        note.setTrip(trip);
        note.setContent(request.getContent());
        return tripNoteRepository.save(note);
    }

    public List<TripNote> getNotes(Long tripId, Long userId) {
        getOwnedTrip(tripId, userId); // ownership check
        return tripNoteRepository.findByTripIdOrderByCreatedAtDesc(tripId);
    }

    @Transactional
    public TripNote updateNote(Long tripId, Long noteId, Long userId, CreateNoteRequest request) {
        getOwnedTrip(tripId, userId); // ownership check

        TripNote note = tripNoteRepository.findByIdAndTripId(noteId, tripId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));

        note.setContent(request.getContent());
        note.setUpdatedAt(LocalDateTime.now());
        return tripNoteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long tripId, Long noteId, Long userId) {
        getOwnedTrip(tripId, userId); // ownership check
        tripNoteRepository.deleteByIdAndTripId(noteId, tripId);
    }

    // ---- Mappers ----

    public TripResponse mapToResponse(Trip trip) {
        long notesCount = tripNoteRepository.findByTripIdOrderByCreatedAtDesc(trip.getId()).size();
        return new TripResponse(
                trip.getId(),
                trip.getTitle(),
                trip.getLocation(),
                trip.getFormattedAddress(),
                trip.getLatitude(),
                trip.getLongitude(),
                trip.getCity(),
                trip.getState(),
                trip.getCountry(),
                trip.getCreatedAt(),
                notesCount
        );
    }

    public List<TripResponse> mapToResponseList(List<Trip> trips) {
        return trips.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TripNoteResponse mapNoteToResponse(TripNote note) {
        return new TripNoteResponse(
                note.getId(),
                note.getContent(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }

    public List<TripNoteResponse> mapNoteToResponseList(List<TripNote> notes) {
        return notes.stream().map(this::mapNoteToResponse).collect(Collectors.toList());
    }

    public List<Trip> getTripsByUserFiltered(Long userId, Integer year) {
    List<Trip> trips = tripRepository.findByUserIdOrderByCreatedAtDesc(userId);
    if (year != null) {
        trips = trips.stream()
                .filter(t -> t.getCreatedAt().getYear() == year)
                .collect(Collectors.toList());
    }
    return trips;
}

public TripStatsResponse getStats(Long userId) {
    List<Trip> allTrips = tripRepository.findByUserIdOrderByCreatedAtDesc(userId);
    int currentYear = LocalDateTime.now().getYear();

    long tripsAllTime = allTrips.size();
    long tripsThisYear = allTrips.stream()
            .filter(t -> t.getCreatedAt().getYear() == currentYear)
            .count();

    // "Places" counted by distinct location string, so revisits to the same
    // spot don't inflate the count. Swap to placeId if you want stricter dedup.
    long placesAllTime = allTrips.stream()
            .map(Trip::getLocation)
            .filter(Objects::nonNull)
            .distinct()
            .count();

    long placesThisYear = allTrips.stream()
            .filter(t -> t.getCreatedAt().getYear() == currentYear)
            .map(Trip::getLocation)
            .filter(Objects::nonNull)
            .distinct()
            .count();

    return new TripStatsResponse(tripsThisYear, tripsAllTime, placesThisYear, placesAllTime);
}

public TripLocationResponse mapToLocationResponse(Trip trip) {
    return new TripLocationResponse(
            trip.getId(),
            trip.getTitle(),
            trip.getLocation(),
            trip.getLatitude(),
            trip.getLongitude(),
            trip.getCreatedAt()
    );
}

public List<TripLocationResponse> mapToLocationResponseList(List<Trip> trips) {
    return trips.stream().map(this::mapToLocationResponse).collect(Collectors.toList());
}
}