package com.example.companyintranet.service;

import com.example.companyintranet.model.Announcement;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnnouncementService {

    private final List<Announcement> announcements = new ArrayList<>();

    public AnnouncementService() {

        announcements.add(
                new Announcement(
                        1L,
                        "Quarterly Meeting",
                        "Company-wide meeting at 3 PM on Friday.",
                        "2026-07-03"
                )
        );

        announcements.add(
                new Announcement(
                        2L,
                        "Holiday Notice",
                        "Office closed on Independence Day.",
                        "2026-08-15"
                )
        );
    }

    public List<Announcement> getAllAnnouncements() {
        return announcements;
    }

    public Announcement addAnnouncement(Announcement announcement) {
        announcements.add(announcement);
        return announcement;
    }
}