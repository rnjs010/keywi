package com.ssafy.product.mapper;

import com.ssafy.product.dto.ProductDto;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Set;

@Mapper
public interface WishMapper {

    @Select("SELECT COUNT(*) > 0 FROM wishes WHERE user_id = #{userId} AND product_id = #{productId}")
    boolean existsWish(@Param("userId") Long userId, @Param("productId") Integer productId);

    @Select({
            "<script>",
            "SELECT product_id FROM wishes WHERE user_id = #{userId} AND product_id IN",
            "<foreach item='id' collection='productIds' open='(' separator=',' close=')'>",
            "#{id}",
            "</foreach>",
            "</script>"
    })
    Set<Integer> findWishedProductIds(@Param("userId") Long userId, @Param("productIds") List<Integer> productIds);

    @Insert("INSERT INTO wishes (user_id, product_id, category_id, updated_at) VALUES (#{userId}, #{productId}, #{categoryId}, NOW())")
    void insertWish(@Param("userId") Long userId, @Param("productId") Integer productId, @Param("categoryId") Integer categoryId);

    @Delete("DELETE FROM wishes WHERE user_id = #{userId} AND product_id = #{productId}")
    void deleteWish(@Param("userId") Long userId, @Param("productId") Integer productId);

    @Select("<script>" +
            "SELECT p.*, " +
            "CASE " +
            "  WHEN c.parent_id IS NOT NULL THEN (SELECT category_name FROM category WHERE category_id = c.parent_id) " +
            "  ELSE c.category_name " +
            "END AS category_name " +
            "FROM products p " +
            "JOIN wishes w ON p.product_id = w.product_id " +
            "JOIN category c ON w.category_id = c.category_id " +  // 카테고리 테이블 조인 추가
            "WHERE w.user_id = #{userId} " +
            "<if test='categoryId != null'>" +
            "  AND w.category_id IN (" +
            "    SELECT category_id FROM category " +
            "    WHERE parent_id = #{categoryId} OR category_id = #{categoryId}" +
            "  )" +
            "</if>" +
            "</script>")
    List<ProductDto> findUserWishes(@Param("userId") Long userId, @Param("categoryId") Integer categoryId);

}
