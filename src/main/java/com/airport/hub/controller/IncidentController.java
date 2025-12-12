package com.airport.hub.controller;

import com.airport.hub.model.IncidentReport;
import com.airport.hub.repository.IncidentReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentReportRepository incidentReportRepository;

    public IncidentController(IncidentReportRepository incidentReportRepository) {
        this.incidentReportRepository = incidentReportRepository;
    }

    @GetMapping
    public ResponseEntity<List<IncidentReport>> getAll() {
        return ResponseEntity.ok(incidentReportRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<IncidentReport> create(@RequestBody IncidentReport incident) {
        return ResponseEntity.ok(incidentReportRepository.save(incident));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentReport> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return incidentReportRepository
                .findById(id)
                .map(incident -> {
                    incident.setStatus(status);
                    return ResponseEntity.ok(incidentReportRepository.save(incident));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
