package com.tuanna.ojt.api.dto;

import java.util.List;

public record StudentEventRequestDto(String studentName, String schoolYear, String event, List<String> hashtags, int page) {

}
