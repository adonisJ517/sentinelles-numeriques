package com.airport.hub.repository;

import com.airport.hub.model.Airline;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirlineRepository extends JpaRepository<Airline, Long> {
    // Des méthodes personnalisées peuvent être ajoutées ici si nécessaire
}
