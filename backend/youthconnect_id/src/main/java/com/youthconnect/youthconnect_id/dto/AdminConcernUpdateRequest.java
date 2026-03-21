package com.youthconnect.youthconnect_id.dto;

import com.youthconnect.youthconnect_id.enums.ConcernStatus;

public class AdminConcernUpdateRequest {
    private int adminId;
    private String updateText;
    private ConcernStatus status;

    public int getAdminId() {
        return adminId; 
    }
    public void setAdminId(int adminId) {
        this.adminId = adminId; 
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
}