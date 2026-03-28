package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CivilStatus {
    SINGLE,
    MARRIED,
    WIDOWED,
    DIVORCED,
    ANNULLED,
    UNKNOWN,
    LIVE_IN;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static CivilStatus fromValue(String value) {
        for (CivilStatus status : CivilStatus.values()) {
            if (status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown civil status: " + value);
    }
}