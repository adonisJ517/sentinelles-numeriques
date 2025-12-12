package com.airport.hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "airlines")
public class Airline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    private Integer servicesCount = 0;

    @Enumerated(EnumType.STRING)
    private AirlineStatus status = AirlineStatus.ACTIF;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getServicesCount() {
        return servicesCount;
    }

    public void setServicesCount(Integer servicesCount) {
        this.servicesCount = servicesCount;
    }

    public AirlineStatus getStatus() {
        return status;
    }

    public void setStatus(AirlineStatus status) {
        this.status = status;
    }
}

enum AirlineStatus {
    ACTIF, INACTIF, MAINTENANCE
}
