package com.ssafy.financial.service;

import com.ssafy.financial.dto.request.SetSimplePasswordRequest;
import com.ssafy.financial.entity.SimplePasswordEntity;
import com.ssafy.financial.repository.SimplePasswordRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PayService {
    private final SimplePasswordRepository simplePasswordRepository;
    private final PasswordEncoder passwordEncoder;

    // 간편 비밀번호 설정
    public void setSimplePassword(SetSimplePasswordRequest request) {
        String encoded = passwordEncoder.encode(request.getRawPassword());

        Optional<SimplePasswordEntity> existing = simplePasswordRepository.findByUserId(request.getUserId());

        SimplePasswordEntity entity = existing.map(e -> {
            e.setEncodedPassword(encoded);
            e.setUpdatedAt(LocalDateTime.now());
            return e;
        }).orElseGet(() -> SimplePasswordEntity.builder()
                .userId(request.getUserId())
                .encodedPassword(encoded)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
        );

        simplePasswordRepository.save(entity);
    }

    // 간편 비밀번호 검증
    public boolean verifyPassword(Integer userId, String rawPassword) {
        SimplePasswordEntity entity = simplePasswordRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("비밀번호가 설정되지 않은 사용자입니다."));

        return passwordEncoder.matches(rawPassword, entity.getEncodedPassword());
    }
}
