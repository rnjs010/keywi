package com.ssafy.feed.mapper;

import com.ssafy.feed.model.FeedProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FeedProductMapper {
    FeedProduct findById(Long feedProductId);

    List<FeedProduct> findByFeedId(Long feedId);

    List<FeedProduct> findByProductId(Long productId);

    List<FeedProduct> findByFeedImageId(Long feedImageId);

    int insert(FeedProduct feedProduct);

    int update(FeedProduct feedProduct);

    int deleteById(Long feedProductId);

    int deleteByFeedId(Long feedId);

    int deleteByProductId(Long productId);

    int updatePosition(
            @Param("feedProductId") Long feedProductId,
            @Param("positionX") double positionX,
            @Param("positionY") double positionY);

    List<FeedProduct> findTemporaryProducts(Long feedId);
}