package com.youthconnect.youthconnect_id.dto;

public class AdminLoginResponse {
    private boolean success;
    private String message;
    private String token;
    private int administratorId;
    private String email;
    private String username;

    public AdminLoginResponse(boolean success, String message) {
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
    public int getAdministratorId() {
        return administratorId; 
    }
    public void setAdministratorId(int administratorId) {
        this.administratorId = administratorId; 
    }
    public String getEmail() {
        return email; 
    }
    public void setEmail(String email) {
        this.email = email; 
    }
    public String getUsername() {
        return username; 
    }
    public void setUsername(String username) {
        this.username = username; 
    }
}