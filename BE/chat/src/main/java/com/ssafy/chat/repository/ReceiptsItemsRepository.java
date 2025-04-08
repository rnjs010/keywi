package com.ssafy.chat.repository;

import com.ssafy.chat.entity.ReceiptsItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptsItemsRepository extends JpaRepository<ReceiptsItems, Long> {
}