package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum YouthClassificationType {
    IN_SCHOOL_YOUTH,
    OUT_OF_SCHOOL_YOUTH,
    WORKING_YOUTH,
    PERSON_WITH_DISABILITY,
    CHILDREN_IN_CONFLICT_LAW,
    INDIGENOUS_PEOPLE;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static YouthClassificationType fromValue(String value) {
        for (YouthClassificationType type : YouthClassificationType.values()) {
            if (type.name().equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown youth classification type: " + value);
    }
}