package com.sitigroup.backend.events;

import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface EventRepository extends MongoRepository<Event, String> {
    @Query("{ 'status': ?0 }")
    Page<Event> findByStatus(Event.Status status, Pageable pageable);

    @Query("{$or: [{'title': { $regex: ?0, $options: 'i' }}, {'summary': { $regex: ?0, $options: 'i' }}, {'description': { $regex: ?0, $options: 'i' }}]}")
    Page<Event> searchByText(String query, Pageable pageable);
}
