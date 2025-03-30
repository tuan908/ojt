package com.tuanna.api.helper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.tuanna.api.constant.Constant;

public class DateTimeHelper {

  /**
   * formatDateString
   * 
   * @param value The LocalDateTime value to format
   * @return The formatted string
   */
  public static String formatDateString(LocalDateTime value) {
    var formatter = DateTimeFormatter.ofPattern(Constant.DATETIME_FORMAT_DASH);
    return formatter.format(value);
  }
}
