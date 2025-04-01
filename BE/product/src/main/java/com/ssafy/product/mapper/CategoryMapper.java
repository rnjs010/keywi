package com.ssafy.product.mapper;

import com.ssafy.product.dto.CategoryDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface CategoryMapper {

    @Select("SELECT * FROM category WHERE parent_id IS NULL")
    List<CategoryDto> findAllParentCategories();

    @Select("SELECT * FROM category WHERE parent_id = #{parentId}")
    List<CategoryDto> findSubCategories(@Param("parentId") int parentId);
}
