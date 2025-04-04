package com.ssafy.search.products.repository;

import com.ssafy.search.products.document.ProductDocument;

import java.util.List;

public interface FeedProductSearchRepository {
    List<ProductDocument> searchByProductName(String keyword, int size);
    List<ProductDocument> search(String keyword, int size, String sort);
    void increaseSearchCount(Integer productId);

}