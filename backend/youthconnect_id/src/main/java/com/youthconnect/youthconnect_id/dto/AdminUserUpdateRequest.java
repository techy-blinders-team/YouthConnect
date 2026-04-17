package com.youthconnect.youthconnect_id.dto;

public class AdminUserUpdateRequest {
    private String email;
    private Boolean active;
    private Boolean isApprove;
    private Integer roleId;

    public String getEmail() {
        return email; 
    }
    public void setEmail(String email) {
        this.email = email; 
    }
    public Boolean getActive() {
        return active; 
    }
    public void setActive(Boolean active) {
        this.active = active; 
    }
    public Boolean getIsApprove() {
        return isApprove; 
    }
    public void setIsApprove(Boolean isApprove) {
        this.isApprove = isApprove; 
    }
    public Integer getRoleId() {
        return roleId; 
    }
    public void setRoleId(Integer roleId) {
        this.roleId = roleId; 
    }
}