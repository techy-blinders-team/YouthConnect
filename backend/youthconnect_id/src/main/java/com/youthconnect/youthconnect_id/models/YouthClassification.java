package com.youthconnect.youthconnect_id.models;

import com.youthconnect.youthconnect_id.enums.EducationBackground;
import com.youthconnect.youthconnect_id.enums.WorkStatus;
import com.youthconnect.youthconnect_id.enums.YouthClassificationType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbl_youth_classification")
public class YouthClassification {
    @Id
    @Column(name = "youth_id")
    private int youthId;

    @Enumerated(EnumType.STRING)
    @Column(name = "youth_classification")
    private YouthClassificationType youthClassification;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "education_background")
    private EducationBackground educationBackground;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_status")
    private WorkStatus workStatus;

    @Column(name = "sk_voter")
    private boolean skVoter;

    @Column(name = "national_voter")
    private boolean nationalVoter;

    @Column(name = "past_voter")
    private boolean pastVoter;

    @Column(name = "num_attended_assemblies")
    private int numAttended; 

    @Column(name = "non_attendance_reason")
    private String nonAttendedReason;
}

    public YouthClassification() {}

    public int getYouthId() {
        return youthId;
    }

    public void setYouthId(int youthId) {
        this.youthId = youthId;
    }

    public YouthClassificationType getYouthClassification() {
        return youthClassification;
    }

    public void setYouthClassification(YouthClassificationType youthClassification) {
        this.youthClassification = youthClassification;
    }

    public EducationBackground getEducationBackground() {
        return educationBackground;
    }

    public void setEducationBackground(EducationBackground educationBackground) {
        this.educationBackground = educationBackground;
    }

    public WorkStatus getWorkStatus() {
        return workStatus;
    }

    public void setWorkStatus(WorkStatus workStatus) {
        this.workStatus = workStatus;
    }

    public boolean isSkVoter() {
        return skVoter;
    }

    public void setSkVoter(boolean skVoter) {
        this.skVoter = skVoter;
    }

    public boolean isNationalVoter() {
        return nationalVoter;
    }

    public void setNationalVoter(boolean nationalVoter) {
        this.nationalVoter = nationalVoter;
    }

    public boolean isPastVoter() {
        return pastVoter;
    }

    public void setPastVoter(boolean pastVoter) {
        this.pastVoter = pastVoter;
    }

    public int getNumAttended() {
        return numAttended;
    }

    public void setNumAttended(int numAttended) {
        this.numAttended = numAttended;
    }

    public String getNonAttendedReason() {
        return nonAttendedReason;
    }

    public void setNonAttendedReason(String nonAttendedReason) {
        this.nonAttendedReason = nonAttendedReason;
    }
