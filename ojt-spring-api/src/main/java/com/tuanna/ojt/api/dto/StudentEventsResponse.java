package com.tuanna.ojt.api.dto;

import java.util.List;

public final record StudentEventsResponse(String code, String name, String grade,
    List<String> events, List<String> hashtags) {
}
