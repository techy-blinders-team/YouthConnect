package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Tasking {
    PUBLICATION_COMMITTEE,
    LETTERS_COMMUNCATION,
    HOST_EMCEE,
    TECHNICAL,
    PRINTING_OF_CERTIFICATES,
    DOCUMENTATION,
    LOGISTICS;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static Tasking fromValue(String value) {
        for (Tasking tasking : Tasking.values()) {
            if (tasking.name().equalsIgnoreCase(value)) {
                return tasking;
            }
        }
        throw new IllegalArgumentException("Unknown tasking: " + value);
    }
}