package com.airport.hub.controller;

import com.airport.hub.model.User;
import com.airport.hub.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        User user = userRepository.findById(id).orElseThrow();
        if (role != null && !role.trim().isEmpty()) {
            user.setRole(role.trim());
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<User> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        User user = userRepository.findById(id).orElseThrow();
        if (status != null && !status.trim().isEmpty()) {
            user.setStatus(status.trim());
        }
        return ResponseEntity.ok(userRepository.save(user));
    }
}
