package com.youthconnect.youthconnect_id.models;

import java.time.LocalDateTime;

import com.youthconnect.youthconnect_id.enums.ConcernStatus;
import com.youthconnect.youthconnect_id.enums.ConcernType;

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
@Table(name = "tbl_concern")
public class Concern {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "concern_id")
    private int concernId;

    @Column(name = "youth_id", nullable = false)
    private int youthId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_of_concern", nullable = false)
    private ConcernType typeOfConcern;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ConcernStatus status = ConcernStatus.OPEN;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Concern() {}

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
