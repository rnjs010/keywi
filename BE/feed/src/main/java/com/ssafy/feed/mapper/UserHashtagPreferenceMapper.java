package com.ssafy.feed.mapper;

import com.ssafy.feed.model.UserHashtagPreference;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface UserHashtagPreferenceMapper {

    /**
     * 사용자의 해시태그 선호도 조회
     */
    UserHashtagPreference findByUserIdAndHashtagId(@Param("userId") Long userId, @Param("hashtagId") Long hashtagId);

    /**
     * 사용자의 모든 해시태그 선호도 조회
     */
    List<UserHashtagPreference> findByUserId(Long userId);

    /**
     * 해시태그별 선호도 점수 조회 (상위 N개)
     */
    List<Map<String, Object>> findTopHashtagsByUserId(@Param("userId") Long userId, @Param("limit") int limit);

    /**
     * 사용자 해시태그 선호도 저장/수정
     */
    int insertOrUpdate(UserHashtagPreference preference);

    /**
     * 사용자 해시태그 선호도 증가 (활동 가중치 기반)
     */
    int incrementScore(@Param("userId") Long userId,
                       @Param("hashtagId") Long hashtagId,
                       @Param("weight") Double weight);

    /**
     * 오래된 선호도 데이터 제거 (선택적)
     */
    int cleanupOldPreferences(@Param("daysToKeep") int daysToKeep);
}
