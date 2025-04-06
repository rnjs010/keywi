package com.ssafy.chat.common.util;

import lombok.experimental.UtilityClass;

@UtilityClass
public class IdConverter {

    /**
     * String ID를 Long으로 안전하게 변환
     */
    public Long toLong(String id) {
        if (id == null || id.isEmpty()) {
            return null;
        }
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid ID format: " + id);
        }
    }

    /**
     * Long ID를 String으로 변환
     */
    public String toString(Long id) {
        return id != null ? id.toString() : null;
    }
}