package com.airport.hub.controller;

import com.airport.hub.model.Payment;
import com.airport.hub.model.PaymentKind;
import com.airport.hub.model.PaymentStatus;
import com.airport.hub.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAll(
            @RequestParam(value = "status", required = false) PaymentStatus status,
            @RequestParam(value = "kind", required = false) PaymentKind kind) {
        if (status != null && kind != null) {
            return ResponseEntity.ok(paymentRepository.findAllByStatusAndKind(status, kind));
        }
        if (status != null) {
            return ResponseEntity.ok(paymentRepository.findAllByStatus(status));
        }
        if (kind != null) {
            return ResponseEntity.ok(paymentRepository.findAllByKind(kind));
        }
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        ZoneId zoneId = ZoneId.systemDefault();
        Instant startOfDay = LocalDate.now(zoneId).atStartOfDay(zoneId).toInstant();

        List<Payment> today = paymentRepository.findAllByCreatedAtGreaterThanEqual(startOfDay);

        BigDecimal total = BigDecimal.ZERO;
        int pendingCount = 0;

        for (Payment p : today) {
            if (p.getAmount() != null) {
                total = total.add(p.getAmount());
            }
            if (p.getStatus() == PaymentStatus.EN_ATTENTE) {
                pendingCount++;
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("totalToday", total.setScale(2, RoundingMode.HALF_UP));
        res.put("transactions", today.size());
        res.put("pending", pendingCount);
        res.put("currency", "EUR");
        return ResponseEntity.ok(res);
    }

    @PostMapping
    public ResponseEntity<Payment> create(@RequestBody CreatePaymentRequest request) {
        Payment payment = new Payment();
        payment.setReference("PAY-" + System.currentTimeMillis());
        payment.setPassenger(request.getPassenger());
        payment.setLabel(request.getLabel());
        payment.setAmount(request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO);
        payment.setCurrency(
                request.getCurrency() != null && !request.getCurrency().trim().isEmpty()
                        ? request.getCurrency().trim()
                        : "XOF");
        payment.setKind(request.getKind() != null ? request.getKind() : PaymentKind.BAGGAGE_EXCESS);
        payment.setStatus(request.getStatus() != null ? request.getStatus() : PaymentStatus.EN_ATTENTE);

        Payment saved = paymentRepository.save(payment);
        return ResponseEntity.ok(saved);
    }

    public static class CreatePaymentRequest {
        private String passenger;
        private String label;
        private BigDecimal amount;
        private String currency;
        private PaymentKind kind;
        private PaymentStatus status;

        public String getPassenger() {
            return passenger;
        }

        public void setPassenger(String passenger) {
            this.passenger = passenger;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public PaymentKind getKind() {
            return kind;
        }

        public void setKind(PaymentKind kind) {
            this.kind = kind;
        }

        public PaymentStatus getStatus() {
            return status;
        }

        public void setStatus(PaymentStatus status) {
            this.status = status;
        }
    }
}
