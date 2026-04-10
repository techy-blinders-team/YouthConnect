package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Suffix {
    JR, SR, I, II, III, OTHER;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static Suffix fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        for (Suffix suffix : Suffix.values()) {
            if (suffix.name().equalsIgnoreCase(value)) {
                return suffix;
            }
        }

        // ✅ Return null instead of throwing for unknown values
        return null;
    }
}