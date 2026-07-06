package com.example.companyintranet.model;

public class Holiday {

    private Long id;
    private String holidayName;
    private String date;
    private String type;

    public Holiday() {}

    public Holiday(Long id, String holidayName,
                   String date, String type) {
        this.id = id;
        this.holidayName = holidayName;
        this.date = date;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHolidayName() {
        return holidayName;
    }

    public void setHolidayName(String holidayName) {
        this.holidayName = holidayName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}