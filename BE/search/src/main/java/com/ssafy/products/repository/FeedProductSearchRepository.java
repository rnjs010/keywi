package com.ssafy.products.repository;

import com.ssafy.products.document.ProductDocument;
import org.springframework.data.relational.core.sql.In;

import java.util.List;

public interface FeedProductSearchRepository {
    List<ProductDocument> searchByProductName(String keyword, int size);
    List<ProductDocument> search(String keyword, int size, String sort);
    void increaseSearchCount(Integer productId);

}