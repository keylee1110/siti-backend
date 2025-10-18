package com.sitigroup.backend.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class AdminEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private EventRepository eventRepository;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateEvent_WithValidData_ShouldReturnCreatedEvent() throws Exception {
        // Given
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle("New Event");
        request.setSummary("Summary");
        request.setDescription("Description");
        request.setStartAt(Instant.now().plus(7, ChronoUnit.DAYS));
        request.setStatus(Event.Status.DRAFT);

        Event savedEvent = new Event();
        savedEvent.setId("generated-id");
        savedEvent.setTitle(request.getTitle());
        savedEvent.setSummary(request.getSummary());
        savedEvent.setDescription(request.getDescription());
        savedEvent.setStartAt(request.getStartAt());
        savedEvent.setStatus(request.getStatus());

        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        // When & Then
        mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value("generated-id"))
                .andExpect(jsonPath("$.data.title").value("New Event"))
                .andExpect(jsonPath("$.data.status").value("DRAFT"));

        verify(eventRepository, times(1)).save(any(Event.class));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testCreateEvent_WithInvalidData_ShouldReturn400() throws Exception {
        // Given - Request với title rỗng (invalid)
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle(""); // Invalid
        request.setStartAt(Instant.now().plus(7, ChronoUnit.DAYS));

        // When & Then
        mockMvc.perform(post("/api/admin/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testUpdateEvent_WhenExists_ShouldReturnUpdatedEvent() throws Exception {
        // Given
        Event existingEvent = new Event();
        existingEvent.setId("1");
        existingEvent.setTitle("Old Title");
        existingEvent.setSummary("Old Summary");
        existingEvent.setStartAt(Instant.now().plus(7, ChronoUnit.DAYS));
        existingEvent.setStatus(Event.Status.DRAFT);

        EventUpdateRequest updateRequest = new EventUpdateRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setStatus(Event.Status.PUBLISHED);

        when(eventRepository.findById("1")).thenReturn(Optional.of(existingEvent));
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArgument(0));

        // When & Then
        mockMvc.perform(put("/api/admin/events/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("Updated Title"))
                .andExpect(jsonPath("$.data.status").value("PUBLISHED"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteEvent_WhenExists_ShouldReturn200() throws Exception {
        // Given
        when(eventRepository.existsById("1")).thenReturn(true);
        doNothing().when(eventRepository).deleteById("1");

        // When & Then
        mockMvc.perform(delete("/api/admin/events/1"))
                .andExpect(status().isOk());

        verify(eventRepository, times(1)).deleteById("1");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testDeleteEvent_WhenNotExists_ShouldReturn404() throws Exception {
        // Given
        when(eventRepository.existsById("999")).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/admin/events/999"))
                .andExpect(status().isNotFound());
    }
}