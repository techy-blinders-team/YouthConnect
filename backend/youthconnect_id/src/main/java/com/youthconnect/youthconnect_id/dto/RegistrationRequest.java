package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDate;
import java.util.List;

import com.youthconnect.youthconnect_id.enums.CivilStatus;
import com.youthconnect.youthconnect_id.enums.EducationBackground;
import com.youthconnect.youthconnect_id.enums.Gender;
import com.youthconnect.youthconnect_id.enums.Suffix;
import com.youthconnect.youthconnect_id.enums.WorkStatus;
import com.youthconnect.youthconnect_id.enums.YouthClassificationType;

public class RegistrationRequest {
    private String email;
    private String password;
    
    private String firstName;
    private String middleName;
    private String lastName;
    private Suffix suffix;
    private Gender gender;
    private LocalDate birthday;
    private String contactNumber;
    private String completeAddress;
    private CivilStatus civilStatus;

    private YouthClassificationType youthClassification;
    private EducationBackground educationBackground;
    private WorkStatus workStatus;
    private boolean skVoter;
    private boolean nationalVoter;
    private boolean pastVoter;
    private int numAttended;
    private String nonAttendedReason;

    private List<DocumentUpload> documents;

    public static class DocumentUpload {
        private String documentType;
        private String filePath;

        public DocumentUpload() {}

        public String getDocumentType() {
            return documentType;
        }

        public void setDocumentType(String documentType) {
            this.documentType = documentType;
        }

        public String getFilePath() {
            return filePath;
        }

        public void setFilePath(String filePath) {
            this.filePath = filePath;
        }
    }

    public RegistrationRequest() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public List<DocumentUpload> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentUpload> documents) {
        this.documents = documents;
    }
}
