package com.tuanna.api.dto;

public record Pagination(int page, // Current page number
		int size, // Items per page
		long totalItems, // Total number of items
		int totalPages // Total pages calculated from totalItems & size
) {
	public static Pagination of(int page, int size, long totalItems) {
		int totalPages = (int) Math.ceil((double) totalItems / size);
		return new Pagination(page, size, totalItems, totalPages);
	}
}
