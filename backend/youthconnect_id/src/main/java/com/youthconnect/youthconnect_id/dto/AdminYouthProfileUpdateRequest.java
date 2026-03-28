package com.youthconnect.youthconnect_id.dto;

import java.time.LocalDate;

import com.youthconnect.youthconnect_id.enums.CivilStatus;
import com.youthconnect.youthconnect_id.enums.Gender;
import com.youthconnect.youthconnect_id.enums.Suffix;

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
}