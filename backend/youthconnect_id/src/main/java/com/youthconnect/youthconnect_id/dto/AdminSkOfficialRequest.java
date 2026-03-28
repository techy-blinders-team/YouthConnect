package com.youthconnect.youthconnect_id.dto;

public class AdminSkOfficialRequest {
    private String firstName;
    private String lastName;
    private String suffix;
    private String email;
    private String password;
    private int roleId;
    private boolean isActive;

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
    public String getSuffix() { 
        return suffix; 
    }
    public void setSuffix(String suffix) { 
        this.suffix = suffix; 
    }
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
    public int getRoleId() { 
        return roleId; 
    }
    public void setRoleId(int roleId) { 
        this.roleId = roleId; 
    }
    public boolean isActive() { 
        return isActive; 
    }
    public void setActive(boolean active) { 
        isActive = active; 
    }
}