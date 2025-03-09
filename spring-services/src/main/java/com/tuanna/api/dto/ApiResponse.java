package com.tuanna.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tuanna.api.constant.ResponseCode;
import com.tuanna.api.constant.ResponseType;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null values
public record ApiResponse<T>(T data, // Payload (generic type for flexibility)
		String code, // Response code (e.g., SUCCESS, NOT_FOUND)
		String message, // Human-readable message
		String error, // Error description (null if success)
		boolean success, // Success flag
		Pagination pagination // Optional pagination metadata,
) {
	public static <T> ApiResponse<T> success(T data, String message) {
		return new ApiResponse<>(data, ResponseCode.SUCCESS.getValue(), message, null, true, null);
	}

	public static <T> ApiResponse<List<T>> paginated(List<T> data, String message, Pagination pagination) {
		return new ApiResponse<>(data != null ? data : List.of(), // Prevents null lists
				ResponseType.SUCCESS.getValue(), message != null ? message : "Success", null, true, pagination);
	}

	public static <T> ApiResponse<T> error(String code, String message, String error) {
		return new ApiResponse<>(null, code, message, error, false, null);
	}
}