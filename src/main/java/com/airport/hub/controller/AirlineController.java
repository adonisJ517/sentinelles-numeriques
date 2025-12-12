package com.airport.hub.controller;

import com.airport.hub.model.Airline;
import com.airport.hub.repository.AirlineRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/airlines")
@CrossOrigin(origins = "*")
public class AirlineController {

    private final AirlineRepository airlineRepository;

    public AirlineController(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    @GetMapping
    public ResponseEntity<List<Airline>> getAllAirlines() {
        return ResponseEntity.ok(airlineRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Airline> createAirline(@RequestBody Airline airline) {
        return ResponseEntity.ok(airlineRepository.save(airline));
    }
}
