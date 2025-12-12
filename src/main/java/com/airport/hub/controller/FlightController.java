package com.airport.hub.controller;

import com.airport.hub.model.Flight;
import com.airport.hub.repository.FlightRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightController {

    private final FlightRepository flightRepository;

    public FlightController(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    @GetMapping
    public ResponseEntity<List<Flight>> getAll() {
        return ResponseEntity.ok(flightRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Flight> create(@RequestBody Flight flight) {
        return ResponseEntity.ok(flightRepository.save(flight));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Flight> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Flight flight = flightRepository.findById(id).orElseThrow();
        if (status != null && !status.trim().isEmpty()) {
            flight.setStatus(status.trim());
        }
        return ResponseEntity.ok(flightRepository.save(flight));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!flightRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        flightRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
