package com.ssafy.financial.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "financial_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "developer_user_id")
    private String userId;
    private String userName;
    private String institutionCode;
    private String userKey;

    @Column(name = "created_at")
    private LocalDateTime created;
    @Column(name = "updated_at")
    private LocalDateTime modified;
}
