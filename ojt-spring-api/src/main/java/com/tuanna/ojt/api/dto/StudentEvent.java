package com.tuanna.ojt.api.dto;

import java.util.List;

public final record StudentEvent(Long id, String code, String name, String grade, String events,
        List<HashtagDto> hashtags) {
}
