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

    @Select("SELECT CASE " +
            "WHEN parent_id IS NOT NULL THEN (SELECT category_name FROM category WHERE category_id = c.parent_id) " +
            "ELSE c.category_name END " +
            "FROM category c WHERE c.category_id = #{categoryId}")
    String findCategoryName(@Param("categoryId") int categoryId);
}
