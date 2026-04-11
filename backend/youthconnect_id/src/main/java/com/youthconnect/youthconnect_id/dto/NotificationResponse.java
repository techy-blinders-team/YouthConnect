package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

public class NotificationResponse {
    private int updateId;
    private int concernId;
    private String concernTitle;
    private String updateText;
    private String updatedByAdminName;
    private LocalDateTime createdAt;

    public NotificationResponse() {}

    public int getUpdateId() {
        return updateId;
    }

    public void setUpdateId(int updateId) {
        this.updateId = updateId;
    }

    public int getConcernId() {
        return concernId;
    }

    public void setConcernId(int concernId) {
        this.concernId = concernId;
    }

    public String getConcernTitle() {
        return concernTitle;
    }

    public void setConcernTitle(String concernTitle) {
        this.concernTitle = concernTitle;
    }

    public String getUpdateText() {
        return updateText;
    }

    public void setUpdateText(String updateText) {
        this.updateText = updateText;
    }

    public String getUpdatedByAdminName() {
        return updatedByAdminName;
    }

    public void setUpdatedByAdminName(String updatedByAdminName) {
        this.updatedByAdminName = updatedByAdminName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
