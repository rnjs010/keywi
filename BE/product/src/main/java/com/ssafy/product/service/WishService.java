package com.ssafy.product.service;

import com.ssafy.product.dto.ProductDto;
import com.ssafy.product.mapper.ProductMapper;
import com.ssafy.product.mapper.WishMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishService {

    private final WishMapper wishMapper;
    private final ProductMapper productMapper;

    // 찜 추가
    public boolean addWish(Long userId, Integer productId) {
        if (wishMapper.existsWish(userId, productId)) {
            return true; // 이미 찜한 상태
        }

        Integer categoryId = productMapper.findCategoryIdByProductId(productId);
        wishMapper.insertWish(userId, productId, categoryId);
        return true;
    }
    // 찜 삭제
    public boolean removeWish(Long userId, Integer productId) {
        if (!wishMapper.existsWish(userId, productId)) {
            return false;
        }
        wishMapper.deleteWish(userId, productId);
        return false;
    }

    // 찜한 상품 목록 조회
    public List<ProductDto> getUserWishes(Long userId, Integer categoryId) {
        return wishMapper.findUserWishes(userId, categoryId);
    }
}
