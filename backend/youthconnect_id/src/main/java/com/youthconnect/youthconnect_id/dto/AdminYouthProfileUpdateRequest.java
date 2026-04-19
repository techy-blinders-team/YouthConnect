package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDate;

import com.youthconnect.youthconnect_id.enums.CivilStatus;
import com.youthconnect.youthconnect_id.enums.EducationBackground;
import com.youthconnect.youthconnect_id.enums.Gender;
import com.youthconnect.youthconnect_id.enums.Suffix;
import com.youthconnect.youthconnect_id.enums.WorkStatus;
import com.youthconnect.youthconnect_id.enums.YouthClassificationType;

public class AdminYouthProfileUpdateRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private Suffix suffix;
    private Gender gender;
    private LocalDate birthday;
    private String contactNumber;
    private String completeAddress;
    private CivilStatus civilStatus;
    private YouthClassificationUpdateRequest youthClassification;

    public static class YouthClassificationUpdateRequest {
        private YouthClassificationType youthClassification;
        private EducationBackground educationBackground;
        private WorkStatus workStatus;
        private Boolean skVoter;
        private Boolean nationalVoter;
        private Boolean pastVoter;
        private Integer numAttended;
        private String nonAttendedReason;

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

        public Boolean getSkVoter() {
            return skVoter;
        }

        public void setSkVoter(Boolean skVoter) {
            this.skVoter = skVoter;
        }

        public Boolean getNationalVoter() {
            return nationalVoter;
        }

        public void setNationalVoter(Boolean nationalVoter) {
            this.nationalVoter = nationalVoter;
        }

        public Boolean getPastVoter() {
            return pastVoter;
        }

        public void setPastVoter(Boolean pastVoter) {
            this.pastVoter = pastVoter;
        }

        public Integer getNumAttended() {
            return numAttended;
        }

        public void setNumAttended(Integer numAttended) {
            this.numAttended = numAttended;
        }

        public String getNonAttendedReason() {
            return nonAttendedReason;
        }

        public void setNonAttendedReason(String nonAttendedReason) {
            this.nonAttendedReason = nonAttendedReason;
        }
    }

    public String getFirstName() {
        return firstName; 
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName; 
    }
    public String getMiddleName() {
        return middleName; 
    }
    public void setMiddleName(String middleName) {
        this.middleName = middleName; 
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
    public Gender getGender() {
        return gender; 
    }
    public void setGender(Gender gender) {
        this.gender = gender; 
    }
    public LocalDate getBirthday() {
        return birthday; 
    }
    public void setBirthday(LocalDate birthday) { 
        this.birthday = birthday; 
    }
    public String getContactNumber() { 
        return contactNumber; 
    }
    public void setContactNumber(String contactNumber) { 
        this.contactNumber = contactNumber; 
    }
    public String getCompleteAddress() { 
        return completeAddress; 
    }
    public void setCompleteAddress(String completeAddress) { 
        this.completeAddress = completeAddress; 
    }
    public CivilStatus getCivilStatus() { 
        return civilStatus; 
    }
    public void setCivilStatus(CivilStatus civilStatus) { 
        this.civilStatus = civilStatus; 
    }

    public YouthClassificationUpdateRequest getYouthClassification() {
        return youthClassification;
    }

    public void setYouthClassification(YouthClassificationUpdateRequest youthClassification) {
        this.youthClassification = youthClassification;
    }
}