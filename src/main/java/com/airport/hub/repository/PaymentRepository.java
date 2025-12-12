package com.airport.hub.repository;

import com.airport.hub.model.Payment;
import com.airport.hub.model.PaymentKind;
import com.airport.hub.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findAllByStatus(PaymentStatus status);

    List<Payment> findAllByKind(PaymentKind kind);

    List<Payment> findAllByStatusAndKind(PaymentStatus status, PaymentKind kind);

    List<Payment> findAllByCreatedAtGreaterThanEqual(Instant createdAt);
}
