package com.youthconnect.youthconnect_id.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbl_youth_profile")
public class YouthProfile {
    @Id
    @Column(name = "youth_id")
    private int youthId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String lastName;

}
