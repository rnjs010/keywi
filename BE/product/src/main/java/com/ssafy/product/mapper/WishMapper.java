package com.ssafy.product.mapper;

import com.ssafy.product.dto.ProductDto;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface WishMapper {

    @Select("SELECT COUNT(*) > 0 FROM wishes WHERE user_id = #{userId} AND product_id = #{productId}")
    boolean existsWish(@Param("userId") Long userId, @Param("productId") Integer productId);

    @Insert("INSERT INTO wishes (user_id, product_id, category_id, updated_at) VALUES (#{userId}, #{productId}, #{categoryId}, NOW())")
    void insertWish(@Param("userId") Long userId, @Param("productId") Integer productId, @Param("categoryId") Integer categoryId);

    @Delete("DELETE FROM wishes WHERE user_id = #{userId} AND product_id = #{productId}")
    void deleteWish(@Param("userId") Long userId, @Param("productId") Integer productId);

    @Select("<script>" +
            "SELECT p.* FROM products p " +
            "JOIN wishes w ON p.product_id = w.product_id " +
            "WHERE w.user_id = #{userId} " +
            "<if test='categoryId != null'> AND w.category_id = #{categoryId} </if>" +
            "</script>")
    List<ProductDto> findUserWishes(@Param("userId") Long userId, @Param("categoryId") Integer categoryId);
}
