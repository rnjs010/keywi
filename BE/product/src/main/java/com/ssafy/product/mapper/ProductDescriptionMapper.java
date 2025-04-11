package com.ssafy.product.mapper;

import com.ssafy.product.dto.ProductDescriptionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductDescriptionMapper {

    // 특정 상품의 상세 설명 조회
    @Select("SELECT * FROM products_descriptions WHERE product_id = #{productId} ORDER BY description_order")
    List<ProductDescriptionDto> findDescriptionsByProductId(@Param("productId") int productId);
}
