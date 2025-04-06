package com.ssafy.financial.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "register_product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountTypeUniqueNo;
    private String bankCode;
    private String bankName;
    private String accountTypeCode;
    private String accountTypeName;
    private String accountName;
    private String accountDescription;
    private String accountType;
}