package com.sitigroup.backend.events;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import org.springframework.data.domain.PageRequest;

import org.springframework.data.mongodb.core.MongoTemplate;



import java.time.Instant;



import static org.assertj.core.api.Assertions.assertThat;



@DataMongoTest

public class EventRepositoryTest {



    @Autowired

    private MongoTemplate mongoTemplate;



        @Autowired



        private EventRepository eventRepository;



    



        @BeforeEach



        public void setup() {



            mongoTemplate.getDb().getCollection("events").drop();



        }



    



        @Test

    public void shouldSearchEventsByText() {

        // given

        var event1 = Event.builder()

                .title("Unique Event Title")

                .summary("This is a specific event summary")

                .description("This is a specific event description")

                .startAt(Instant.now())

                .status(Event.Status.PUBLISHED)

                .build();



        var event2 = Event.builder()

                .title("Another Event")

                .summary("This is another event")

                .description("This is another event description")

                .startAt(Instant.now())

                .status(Event.Status.PUBLISHED)

                .build();



        mongoTemplate.insert(event1);

        mongoTemplate.insert(event2);



        // when

        var result = eventRepository.searchByText("Uni", PageRequest.of(0, 10));



        // then

        assertThat(result.getContent()).hasSize(1);

        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Unique Event Title");

    }

}


