package com.airport.hub.repository;

import com.airport.hub.model.BaggageClaim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaggageClaimRepository extends JpaRepository<BaggageClaim, Long> {
}
