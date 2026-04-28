package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.ConcernStatus;

public class ConcernUpdateResponse {
    private int updateId;
    private int concernId;
    private Integer updatedByAdminId;
    private String updateText;
    private ConcernStatus status;
    private LocalDateTime createdAt;

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

    public Integer getUpdatedByAdminId() {
        return updatedByAdminId;
    }

    public void setUpdatedByAdminId(Integer updatedByAdminId) {
        this.updatedByAdminId = updatedByAdminId;
    }

    public String getUpdateText() {
        return updateText;
    }

    public void setUpdateText(String updateText) {
        this.updateText = updateText;
    }

    public ConcernStatus getStatus() {
        return status;
    }

    public void setStatus(ConcernStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
