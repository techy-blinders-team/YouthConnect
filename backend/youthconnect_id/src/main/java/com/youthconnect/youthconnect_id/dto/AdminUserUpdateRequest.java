package com.youthconnect.youthconnect_id.dto;

public class AdminUserUpdateRequest {
    private String email;
    private Boolean active;
    private String status;
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
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public Integer getRoleId() {
        return roleId; 
    }
    public void setRoleId(Integer roleId) {
        this.roleId = roleId; 
    }
}