package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

public class AdministratorResponse {
    private int administratorId;
    private String username;
    private String email;
    private boolean active;
    private LocalDateTime createdAt;

    public AdministratorResponse() {
    }

    public AdministratorResponse(int administratorId, String username, String email, boolean active, LocalDateTime createdAt) {
        this.administratorId = administratorId;
        this.username = username;
        this.email = email;
        this.active = active;
        this.createdAt = createdAt;
    }

    public int getAdministratorId() {
        return administratorId;
    }

    public void setAdministratorId(int administratorId) {
        this.administratorId = administratorId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
