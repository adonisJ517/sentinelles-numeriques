package com.airport.hub.repository;

import com.airport.hub.model.Content;
import com.airport.hub.model.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findAllByType(ContentType type);
}
