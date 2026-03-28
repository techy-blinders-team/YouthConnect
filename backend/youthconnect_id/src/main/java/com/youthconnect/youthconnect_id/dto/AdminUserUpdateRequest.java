package com.youthconnect.youthconnect_id.dto;

public class AdminUserUpdateRequest {
    private String email;
    private boolean isActive;
    private boolean isApprove;
    private int roleId;

    public String getEmail() {
        return email; 
    }
    public void setEmail(String email) {
        this.email = email; 
    }
    public boolean isActive() {
        return isActive; 
    }
    public void setActive(boolean active) {
        isActive = active; 
    }
    public boolean isApprove() {
        return isApprove; 
    }
    public void setApprove(boolean approve) {
        isApprove = approve; 
    }
    public int getRoleId() {
        return roleId; 
    }
    public void setRoleId(int roleId) {
        this.roleId = roleId; 
    }
}