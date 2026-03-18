package com.youthconnect.youthconnect_id.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbl_concern_update")
public class ConcernUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "update_id")
    private int updateId;

    @Column(name = "concern_id", nullable = false)
    private int concernId;

    @Column(name = "updated_by_admin_id")
    private Integer updatedByAdminId;

    @Column(name = "update_text", nullable = false, columnDefinition = "TEXT")
    private String updateText;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public ConcernUpdate() {}

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
