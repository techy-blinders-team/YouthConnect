package com.youthconnect.youthconnect_id.models;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.Suffix;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbl_sk_offcial")
public class SkOfficialsUser {
 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private int adminId;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;
 
    @Column(name = "first_name")
    private String firstName;
 
    @Column(name = "last_name")
    private String lastName;
 
    @Enumerated(EnumType.STRING)
    @Column(name = "suffix")
    private Suffix suffix;
 
    @Column(name = "email")
    private String email;
 
    @Column(name = "password_hash")
    private String passwordHash;
 
    @Column(name = "is_active")
    private boolean isActive;
 
    @Column(name = "created_at")
    private LocalDateTime createdAt;
 
    public SkOfficialsUser() {}
 
    public int getAdminId() {
        return adminId; 
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId; 
    }
 
    public Role getRole() {
        return role; 
    }

    public void setRole(Role role) {
        this.role = role; 
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
 
    public Suffix getSuffix() {
        return suffix; 
    }

    public void setSuffix(Suffix suffix) {
        this.suffix = suffix; 
    }
 
    public String getEmail() {
        return email; 
    }

    public void setEmail(String email) {
        this.email = email; 
    }
 
    public String getPasswordHash() {
        return passwordHash; 
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash; 
    }
 
    public boolean isActive() {
        return isActive; 
    }

    public void setActive(boolean active) {
        isActive = active; 
    }
 
    public LocalDateTime getCreatedAt() {
        return createdAt; 
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
