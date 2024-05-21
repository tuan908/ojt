package com.tuanna.ojt.api.dto;

import com.tuanna.ojt.api.constants.OjtResponseCode;
import com.tuanna.ojt.api.constants.OjtResponseType;

public record OjtResponseDto(String message, OjtResponseType type, OjtResponseCode code, Object data) {}
