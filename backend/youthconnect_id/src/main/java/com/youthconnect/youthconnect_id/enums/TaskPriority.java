package com.youthconnect.youthconnect_id.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TaskPriority {
    LOW,
    MEDIUM,
    HIGH;

    @JsonValue
    public String getValue() {
        return this.name();
    }

    @JsonCreator
    public static TaskPriority fromValue(String value) {
        for (TaskPriority priority : TaskPriority.values()) {
            if (priority.name().equalsIgnoreCase(value)) {
                return priority;
            }
        }
        throw new IllegalArgumentException("Unknown task priority: " + value);
    }
}