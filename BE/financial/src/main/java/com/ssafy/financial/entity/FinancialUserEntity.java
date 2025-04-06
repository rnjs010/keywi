package com.ssafy.financial.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    private String userId;
    private String userName;
    private String institutionCode;
    private String userKey;

    private LocalDateTime created;
    private LocalDateTime modified;
}
