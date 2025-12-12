package com.airport.hub.controller;

import com.airport.hub.repository.BaggageClaimRepository;
import com.airport.hub.repository.FlightRepository;
import com.airport.hub.repository.IncidentReportRepository;
import com.airport.hub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    private final FlightRepository flightRepository;
    private final IncidentReportRepository incidentReportRepository;
    private final BaggageClaimRepository baggageClaimRepository;
    private final UserRepository userRepository;

    public AdminDashboardController(
            FlightRepository flightRepository,
            IncidentReportRepository incidentReportRepository,
            BaggageClaimRepository baggageClaimRepository,
            UserRepository userRepository) {
        this.flightRepository = flightRepository;
        this.incidentReportRepository = incidentReportRepository;
        this.baggageClaimRepository = baggageClaimRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalFlights(flightRepository.count());
        stats.setTotalIncidents(incidentReportRepository.count());
        stats.setTotalBaggageClaims(baggageClaimRepository.count());
        stats.setTotalUsers(userRepository.count());
        return ResponseEntity.ok(stats);
    }

    public static class DashboardStats {
        private long totalFlights;
        private long totalIncidents;
        private long totalBaggageClaims;
        private long totalUsers;

        public long getTotalFlights() {
            return totalFlights;
        }

        public void setTotalFlights(long totalFlights) {
            this.totalFlights = totalFlights;
        }

        public long getTotalIncidents() {
            return totalIncidents;
        }

        public void setTotalIncidents(long totalIncidents) {
            this.totalIncidents = totalIncidents;
        }

        public long getTotalBaggageClaims() {
            return totalBaggageClaims;
        }

        public void setTotalBaggageClaims(long totalBaggageClaims) {
            this.totalBaggageClaims = totalBaggageClaims;
        }

        public long getTotalUsers() {
            return totalUsers;
        }

        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }
    }
}
