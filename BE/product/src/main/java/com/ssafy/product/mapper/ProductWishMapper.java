package com.ssafy.product.mapper;

import com.ssafy.product.dto.ProductDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductWishMapper {
    @Select("SELECT p.*, " +
            "CASE WHEN w.product_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite " +
            "FROM products p " +
            "LEFT JOIN wishes w ON p.product_id = w.product_id AND w.user_id = #{userId}")
    List<ProductDto> findAllProductsWithWish(@Param("userId") Long userId);

    @Select("<script>" +
            "SELECT p.*, " +
            "CASE WHEN w.product_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite " +
            "FROM products p " +
            "LEFT JOIN wishes w ON p.product_id = w.product_id AND w.user_id = #{userId} " +
            "WHERE p.category_id IN " +
            "<foreach item='id' collection='categoryIds' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<ProductDto> findProductsWithWishInCategories(@Param("categoryIds") List<Integer> categoryIds,
                                                      @Param("userId") Long userId);

    @Select("<script>" +
            "SELECT p.*, " +
            "CASE WHEN w.product_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite " +
            "FROM products p " +
            "LEFT JOIN wishes w ON p.product_id = w.product_id AND w.user_id = #{userId} " +
            "WHERE p.product_id IN " +
            "<foreach item='id' collection='productIds' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<ProductDto> findProductsByIdsWithWish(@Param("productIds") List<Integer> productIds,
                                               @Param("userId") Long userId);

    @Select("SELECT p.*, " +
            "CASE WHEN w.product_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite " +
            "FROM products p " +
            "LEFT JOIN wishes w ON p.product_id = w.product_id AND w.user_id = #{userId} " +
            "WHERE p.product_id = #{productId}")
    ProductDto findProductByIdWithWish(@Param("productId") int productId, @Param("userId") Long userId);

}