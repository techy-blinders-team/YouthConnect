package com.youthconnect.youthconnect_id.dto;

public class UserRejectionRequest {
    private int userId;
    private String reason;

    public UserRejectionRequest() {}

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
