package com.tuanna.api.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.tuanna.api.constant.Constant;
import com.tuanna.api.constant.ResponseType;

@JsonInclude(JsonInclude.Include.NON_NULL) // Exclude null values
public record ApiResponse<T>(T data, // Payload (generic type for flexibility)
    String code, // Response code (e.g., SUCCESS, NOT_FOUND)
    String message, // Human-readable message
    String error, // Error description (null if success)
    boolean success, // Success flag
    Pagination pagination // Optional pagination metadata,
) {

  /**
   * Success Response Utility
   * 
   * @param <T> Data Type
   * @param data
   * @param message
   * @return
   */
  public static <T> ApiResponse<T> success(T data, String message) {
    return new ApiResponse<>(data, Constant.CODE_OK, message, null, true, null);
  }

  /**
   * Paginated Api Response Utility
   * 
   * @param <T> Data Type
   * @param data
   * @param message
   * @param pagination
   * @return
   */
  public static <T> ApiResponse<List<T>> paginated(List<T> data, String message,
      Pagination pagination) {
    return new ApiResponse<>(data != null ? data : List.of(), // Prevents null lists
        ResponseType.SUCCESS.getValue(), message != null ? message : "Success", null, true,
        pagination);
  }

  /**
   * Error Api Response Utility
   * 
   * @param <T> Data Type
   * @param code Error code
   * @param message Message
   * @param error Error detail
   * @return
   */
  public static <T> ApiResponse<T> error(String code, String message, String error) {
    return new ApiResponse<>(null, code, message, error, false, null);
  }
}
