package com.tuanna.api.dto;

public record Pagination(
        int page,        // Current page number
        int size,        // Items per page
        long totalItems, // Total number of items
        int totalPages   // Total pages calculated from totalItems & size
) {
    public static Pagination of(int page, int size, long totalItems) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        if (totalItems < 0) totalItems = 0;

        int totalPages = (size == 0) ? 0 : (int) Math.ceil((double) totalItems / size);
        return new Pagination(page, size, totalItems, totalPages);
    }
}