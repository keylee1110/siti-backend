
package com.sitigroup.backend.events;

import com.sitigroup.backend.core.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.*;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = EventController.class,
        excludeAutoConfiguration = {
                org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
        })
@Import(GlobalExceptionHandler.class)
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EventRepository eventRepository;

    @Test
    void testListPublishedEvents_ShouldReturnPaginatedEvents() throws Exception {
        // Given
        Event event1 = createTestEvent("1", "Event 1", Event.Status.PUBLISHED);
        Event event2 = createTestEvent("2", "Event 2", Event.Status.PUBLISHED);

        Page<Event> page = new PageImpl<>(List.of(event1, event2),
                PageRequest.of(0, 10), 2);

        when(eventRepository.findByStatus(eq(Event.Status.PUBLISHED), any(Pageable.class)))
                .thenReturn(page);

        // When & Then
        mockMvc.perform(get("/api/events")
                        .param("status", "PUBLISHED")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.content.length()").value(2))
                .andExpect(jsonPath("$.data.totalElements").value(2))
                .andExpect(jsonPath("$.data.content[0].title").value("Event 1"));
    }

    @Test
    void testGetEventById_WhenExists_ShouldReturnEvent() throws Exception {
        // Given
        Event event = createTestEvent("1", "Test Event", Event.Status.PUBLISHED);
        when(eventRepository.findById("1")).thenReturn(Optional.of(event));

        // When & Then
        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("1"))
                .andExpect(jsonPath("$.data.title").value("Test Event"));
    }

    @Test
    void testGetEventById_WhenNotExists_ShouldReturn404() throws Exception {
        // Given
        when(eventRepository.findById("999")).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/events/999"))
                .andExpect(status().isNotFound());
    }

    private Event createTestEvent(String id, String title, Event.Status status) {
        Event event = new Event();
        event.setId(id);
        event.setTitle(title);
        event.setSummary("Test summary");
        event.setDescription("Test description");
        event.setStartAt(Instant.now().plusSeconds(86400));
        event.setStatus(status);
        return event;
    }
}