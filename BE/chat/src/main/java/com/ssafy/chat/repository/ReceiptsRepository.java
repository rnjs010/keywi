package com.ssafy.chat.repository;

import com.ssafy.chat.entity.Receipts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptsRepository extends JpaRepository<Receipts, Long> {
}