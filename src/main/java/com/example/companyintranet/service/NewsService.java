package com.example.companyintranet.service;

import com.example.companyintranet.model.News;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NewsService {

    private final List<News> newsList = new ArrayList<>();

    public NewsService() {
        newsList.add(new News(
                1L,
                "New Office Opened",
                "The company has opened a new office in Singapore.",
                "Corporate Communications",
                "2026-07-03"
        ));
    }

    public List<News> getAllNews() {
        return newsList;
    }

    public News addNews(News news) {
        newsList.add(news);
        return news;
    }
}