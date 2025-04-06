package com.ssafy.financial.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "demand_deposit_products")
@Getter @Setter
public class RegisterProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankCode;
    private String bankName;
    private String accountTypeUniqueNo;
    private String accountTypeCode;
    private String accountTypeName;
    private String accountName;
    private String accountDescription;
    private String accountType;

    private LocalDateTime createdAt;
}