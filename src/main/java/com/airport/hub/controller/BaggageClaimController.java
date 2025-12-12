package com.airport.hub.controller;

import com.airport.hub.model.BaggageClaim;
import com.airport.hub.repository.BaggageClaimRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/baggage-claims")
@CrossOrigin(origins = "*")
public class BaggageClaimController {

    private final BaggageClaimRepository baggageClaimRepository;

    public BaggageClaimController(BaggageClaimRepository baggageClaimRepository) {
        this.baggageClaimRepository = baggageClaimRepository;
    }

    @GetMapping
    public ResponseEntity<List<BaggageClaim>> getAll() {
        return ResponseEntity.ok(baggageClaimRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<BaggageClaim> create(@RequestBody BaggageClaim claim) {
        return ResponseEntity.ok(baggageClaimRepository.save(claim));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BaggageClaim> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return baggageClaimRepository
                .findById(id)
                .map(claim -> {
                    claim.setStatus(status);
                    return ResponseEntity.ok(baggageClaimRepository.save(claim));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
