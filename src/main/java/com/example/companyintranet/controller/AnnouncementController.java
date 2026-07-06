package com.example.companyintranet.controller;

import com.example.companyintranet.model.Announcement;
import com.example.companyintranet.service.AnnouncementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(
            AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public List<Announcement> getAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    @PostMapping
    public Announcement addAnnouncement(
            @RequestBody Announcement announcement) {
        return announcementService.addAnnouncement(announcement);
    }
}