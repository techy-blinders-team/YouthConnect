package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WorkStatus {
    EMPLOYED,
    UNEMPLOYED,
    SELF_EMPLOYED,
    CURRENTLY_LOOKING,
    NOT_INTERESTED;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static WorkStatus fromValue(String value) {
        for (WorkStatus status : WorkStatus.values()) {
            if (status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown work status: " + value);
    }
}