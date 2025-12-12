package com.airport.hub.controller;

import com.airport.hub.model.Content;
import com.airport.hub.model.ContentStatus;
import com.airport.hub.model.ContentType;
import com.airport.hub.repository.ContentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
@CrossOrigin(origins = "*")
public class ContentController {

    private final ContentRepository contentRepository;

    public ContentController(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Content>> getAll(@RequestParam(value = "type", required = false) ContentType type) {
        if (type == null) {
            return ResponseEntity.ok(contentRepository.findAll());
        }
        return ResponseEntity.ok(contentRepository.findAllByType(type));
    }

    @PostMapping
    public ResponseEntity<Content> create(@RequestBody Content content) {
        if (content.getStatus() == null) {
            content.setStatus(ContentStatus.ACTIF);
        }
        return ResponseEntity.ok(contentRepository.save(content));
    }
}
