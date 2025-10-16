package com.sitigroup.backend.core;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private final T data;
    private final Map<String, Object> error;
    private final Map<String, Object> meta;

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data, null, null);
    }
    public static <T> ApiResponse<T> error(Map<String, Object> error, Map<String, Object> meta) {
        return new ApiResponse<>(null, error, meta);
    }
}