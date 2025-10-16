package com.sitigroup.backend.core;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex){
        Map<String, Object> err = Map.of(
                "type", "validation",
                "details", ex.getBindingResult().getFieldErrors().stream()
                        .collect(Collectors.toMap(FieldError::getField, DefaultMessageSourceResolvable::getDefaultMessage, (a,b)->a))
        );
        return ResponseEntity.badRequest().body(ApiResponse.error(err, null));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatus(ResponseStatusException ex) {
        Map<String, Object> err = Map.of(
                "type", "http",
                "status", ex.getStatusCode().value(),
                "message", ex.getReason()
        );
        return ResponseEntity.status(ex.getStatusCode()).body(ApiResponse.error(err, null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleAny(Exception ex){
        Map<String, Object> err = Map.of(
                "type","internal",
                "message", ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(err, null));
    }
}
