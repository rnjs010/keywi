package com.ssafy.product.mapper;

import com.ssafy.product.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductMapper {

    // 전체 상품 조회
    @Select("SELECT  * FROM products")
    List<ProductDto> findAllProducts();

    // 특정 카테고리의 상품 조회
    @Select("SELECT * FROM products WHERE category_id = #{categoryId}")
    List<ProductDto> findProductsByCategory(@Param("categoryId") int categoryId);

    // 특정 2차 카테고리의 상품 조회
    @Select("SELECT * FROM products WHERE category_id = #{categoryId} OR category_id IN " +
            "(SELECT category_id FROM category WHERE parent_id = #{categoryId})")
    List<ProductDto> findProductsByCategoryWithSub(@Param("categoryId") int categoryId);

    @Select("<script>" +
            "SELECT product_id, name, price, category_id, image_url FROM products " +
            "WHERE category_id IN " +
            "<foreach item='id' collection='categoryIds' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<ProductDto> findProductsInCategories(@Param("categoryIds") List<Integer> categoryIds);


    // 상품 상세 조회
    @Select("SELECT * FROM products WHERE product_id = #{productId}")
    ProductDto findProductById(@Param("productId") int productId);
    
    // 상품 리스트 조회 + 찜 여부
    @Select("<script>" +
            "SELECT * FROM products " +
            "<if test='productIds != null and productIds.size() > 0'>" +
            "WHERE product_id IN " +
            "<foreach item='id' collection='productIds' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</if>" +
            "</script>")
    List<ProductDto> findProductsByIds(@Param("productIds") List<Integer> productIds);

    // 상품 아이디로 카테고리 조회
    @Select("SELECT category_id FROM products WHERE product_id = #{productId}")
    Integer findCategoryIdByProductId(@Param("productId") Integer productId);
}
