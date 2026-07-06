package com.example.companyintranet.service;

import com.example.companyintranet.model.Holiday;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HolidayService {

    private final List<Holiday> holidays = new ArrayList<>();

    public HolidayService() {

        holidays.add(new Holiday(
                1L,
                "Independence Day",
                "2026-08-15",
                "National Holiday"
        ));

        holidays.add(new Holiday(
                2L,
                "Christmas",
                "2026-12-25",
                "Public Holiday"
        ));
    }

    public List<Holiday> getAllHolidays() {
        return holidays;
    }

    public Holiday addHoliday(Holiday holiday) {
        holidays.add(holiday);
        return holiday;
    }
}