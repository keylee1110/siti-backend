package com.sitigroup.backend.events;

import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface EventRepository extends MongoRepository<Event, String> {
    @Query("{ 'status': ?0 }")
    Page<Event> findByStatus(Event.Status status, Pageable pageable);
}
