package com.example.companyintranet.model;

public class Policy {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String lastUpdated;

    public Policy() {}

    public Policy(Long id, String title, String description,
                  String category, String lastUpdated) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.lastUpdated = lastUpdated;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}