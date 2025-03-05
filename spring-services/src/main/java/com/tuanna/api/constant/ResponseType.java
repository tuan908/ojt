package com.tuanna.api.constant;

import java.util.Map;
import java.util.HashMap;

public enum ResponseType {

    SUCCESS("Success"),
    CREATED("Created"),
    ACCEPTED("Accepted"),
    NO_CONTENT("No Content"),
    BAD_REQUEST("Bad Request"),
    UNAUTHORIZED("Unauthorized"),
    FORBIDDEN("Forbidden"),
    NOT_FOUND("Not Found"),
    CONFLICT("Conflict"),
    INTERNAL_SERVER_ERROR("Internal Server Error"),
    SERVICE_UNAVAILABLE("Service Unavailable"),
    ERROR("Error"),
    TIMEOUT("Timeout");

    private static final Map<String, ResponseType> VALUE_MAP = new HashMap<>();

    static {
        for (ResponseType type : ResponseType.values()) {
            VALUE_MAP.put(type.value, type);
        }
    }

    private final String value;

    ResponseType(String value) {
        this.value = value;
    }

    public String getValue() {
        return this.value;
    }

    @Override
    public String toString() {
        return this.value;
    }

    public static ResponseType fromShortName(String dbValue) {
        ResponseType type = VALUE_MAP.get(dbValue);
        if (type == null) {
            throw new IllegalArgumentException("Unexpected value: " + dbValue);
        }
        return type;
    }
}
