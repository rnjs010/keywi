package com.ssafy.product.mapper;

import com.ssafy.product.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductMapper {

    // 전체 상품 조회
    @Select("SELECT * FROM products")
    List<ProductDto> findAllProducts();

    // 특정 카테고리의 상품 조회
    @Select("SELECT * FROM products WHERE category_id = #{categoryId}")
    List<ProductDto> findProductsByCategory(@Param("categoryId") int categoryId);

    // 특정 2차 카테고리의 상품 조회
    @Select("SELECT * FROM products WHERE category_id = #{categoryId} OR category_id IN " +
            "(SELECT category_id FROM category WHERE parent_id = #{categoryId})")
    List<ProductDto> findProductsByCategoryWithSub(@Param("categoryId") int categoryId);

    // 상품 상세 조회
    @Select("SELECT * FROM products WHERE product_id = #{productId}")
    ProductDto findProductById(@Param("productId") int productId);
}
