package com.youthconnect.youthconnect_id.dto;

import com.youthconnect.youthconnect_id.enums.ConcernType;

public class ConcernRequest {
    private int youthId;
    private ConcernType typeOfConcern;
    private String title;
    private String description;

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
}
