package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ConcernType {
    PROJECT_CONCERN,
    COMMUNITY_CONCERN,
    SYSTEM_CONCERN;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static ConcernType fromValue(String value) {
        for (ConcernType type : ConcernType.values()) {
            if (type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown concern type: " + value);
    }
}