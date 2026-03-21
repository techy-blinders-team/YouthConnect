package com.youthconnect.youthconnect_id.dto;

public class SkOfficialLoginResponse {
    private boolean success;
    private String message;
    private String token;
    private int adminId;
    private String email;
    private String firstName;
    private String lastName;
    private int roleId;

    public SkOfficialLoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success; 
    }

    public void setSuccess(boolean success) {
        this.success = success; 
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message; 
    }
    public String getToken() {
        return token; 
    }
    public void setToken(String token) {
        this.token = token; 
    }
    public int getAdminId() {
        return adminId; 
    }
    public void setAdminId(int adminId) {
        this.adminId = adminId; 
    }
    public String getEmail() {
        return email; 
    }
    public void setEmail(String email) {
        this.email = email; 
    }
    public String getFirstName() {
        return firstName; 
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName; 
    }
    public String getLastName() {
        return lastName; 
    }
    public void setLastName(String lastName) {
        this.lastName = lastName; 
    }
    public int getRoleId() {
        return roleId; 
    }
    public void setRoleId(int roleId) {
        this.roleId = roleId; 
    }
}
