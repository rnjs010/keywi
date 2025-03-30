package com.ssafy.feed.repository;

import com.ssafy.feed.document.FeedProductDocument;

import java.util.List;

public interface FeedProductSearchRepository {
    List<FeedProductDocument> searchByProductName(String keyword, int size);
    List<FeedProductDocument> search(String keyword, int size, String sort);
}