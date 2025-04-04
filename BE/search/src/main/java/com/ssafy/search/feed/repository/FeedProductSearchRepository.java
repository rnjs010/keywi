package com.ssafy.search.feed.repository;

import com.ssafy.search.feed.document.FeedProductDocument;

import java.util.List;

public interface FeedProductSearchRepository {
    List<FeedProductDocument> searchByProductName(String keyword);
    List<FeedProductDocument> search(String keyword, String sort);
    void increaseSearchCount(Integer productId);

}