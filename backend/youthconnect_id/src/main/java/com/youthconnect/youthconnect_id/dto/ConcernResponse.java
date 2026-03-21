package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.ConcernStatus;
import com.youthconnect.youthconnect_id.enums.ConcernType;

public class ConcernResponse {
    private int concernId;
    private int youthId;
    private ConcernType typeOfConcern;
    private String title;
    private String description;
    private ConcernStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public int getConcernId() {
        return concernId; 
    }
    public void setConcernId(int concernId) {
        this.concernId = concernId; 
    }
    public int getYouthId() {
        return youthId; 
    }
    public void setYouthId(int youthId) {
        this.youthId = youthId; 
    }
    public ConcernType getTypeOfConcern() {
        return typeOfConcern; 
    }
    public void setTypeOfConcern(ConcernType typeOfConcern) {
        this.typeOfConcern = typeOfConcern; 
    }
    public String getTitle() {
        return title; 
    }
    public void setTitle(String title) {
        this.title = title; 
    }
    public String getDescription() {
        return description; 
    }
    public void setDescription(String description) {
        this.description = description; 
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
    public LocalDateTime getUpdatedAt() {
        return updatedAt; 
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt; 
    }
}