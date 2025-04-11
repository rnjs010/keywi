-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: financial
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `demand_deposit_account`
--

DROP TABLE IF EXISTS `demand_deposit_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demand_deposit_account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_key` varchar(255) NOT NULL,
  `account_type_unique_no` varchar(255) NOT NULL,
  `bank_code` varchar(20) NOT NULL,
  `account_no` varchar(50) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `currency_name` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_no` (`account_no`,`bank_code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demand_deposit_account`
--

LOCK TABLES `demand_deposit_account` WRITE;
/*!40000 ALTER TABLE `demand_deposit_account` DISABLE KEYS */;
INSERT INTO `demand_deposit_account` VALUES (1,'042dc87f-0817-4f61-b879-cc1b27d59e58','020-1-f5b74047a04b4a','020','0209925175447009','KRW','원화','2025-04-08 14:50:57'),(2,'042dc87f-0817-4f61-b879-cc1b27d59e58','020-1-f5b74047a04b4a','020','0207800517680328','KRW','원화','2025-04-08 14:52:14'),(3,'042dc87f-0817-4f61-b879-cc1b27d59e58','999-1-dc42d6724b1042','999','9995825617095633','KRW','원화','2025-04-09 00:37:19'),(4,'042dc87f-0817-4f61-b879-cc1b27d59e58','088-1-d369bf47170246','088','0887821628350962','KRW','원화','2025-04-09 02:51:17'),(5,'042dc87f-0817-4f61-b879-cc1b27d59e58','088-1-b114c4b7f62b49','088','0880630085153865','KRW','원화','2025-04-09 02:51:56'),(6,'042dc87f-0817-4f61-b879-cc1b27d59e58','020-1-e76a11ded74f4c','020','0203887137825809','KRW','원화','2025-04-09 14:05:06'),(7,'042dc87f-0817-4f61-b879-cc1b27d59e58','999-1-abb94d98416b42','999','9993467448670632','KRW','원화','2025-04-09 22:30:41'),(8,'9910f499-e58b-42af-9de8-899ad3f3a4e6','999-1-0fe9c833bb2941','999','9991274160132470','KRW','원화','2025-04-10 22:22:32'),(9,'9910f499-e58b-42af-9de8-899ad3f3a4e6','020-1-d1070c55205f44','020','0206219514791993','KRW','원화','2025-04-11 03:22:05'),(10,'9910f499-e58b-42af-9de8-899ad3f3a4e6','020-1-c1d1050af99a44','020','0208287924386780','KRW','원화','2025-04-11 03:24:36');
/*!40000 ALTER TABLE `demand_deposit_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `escrow_transaction`
--

DROP TABLE IF EXISTS `escrow_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escrow_transaction` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  `builder_id` bigint NOT NULL,
  `product_description` text,
  `amount` bigint NOT NULL,
  `total_amount` bigint NOT NULL,
  `status` enum('PENDING','PAID','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_escrow_buyer` (`buyer_id`),
  KEY `fk_escrow_builder` (`builder_id`),
  CONSTRAINT `fk_escrow_builder` FOREIGN KEY (`builder_id`) REFERENCES `keywi`.`users` (`user_id`),
  CONSTRAINT `fk_escrow_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `keywi`.`users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escrow_transaction`
--

LOCK TABLES `escrow_transaction` WRITE;
/*!40000 ALTER TABLE `escrow_transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `escrow_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_user`
--

DROP TABLE IF EXISTS `financial_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `developer_user_id` varchar(100) NOT NULL COMMENT '개발자 등록용 내부 식별자',
  `user_name` varchar(100) NOT NULL,
  `institution_code` varchar(20) NOT NULL,
  `user_key` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_key` (`user_key`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_user`
--

LOCK TABLES `financial_user` WRITE;
/*!40000 ALTER TABLE `financial_user` DISABLE KEYS */;
INSERT INTO `financial_user` VALUES (1,'heyrong22@asdasd.com','heyrong22','00100','49495dc3-8e37-43ed-8fe5-e69604dca9d2','2025-04-08 05:50:40','2025-04-08 05:50:40'),(2,'keywi@rbfl.com','keywi','00100','d75dd729-4815-4eac-af64-bf8158908e79','2025-04-08 15:34:13','2025-04-08 15:34:13'),(3,'keywi@rbflrbfl.com','keywi','00100','163242ab-8f5f-406d-997a-e15b00a7a569','2025-04-08 17:46:34','2025-04-08 17:46:34'),(4,'keywi@tnghkstnghks.com','keywi','00100','5ab97c80-b698-4dc9-beeb-650f6cbc4454','2025-04-08 17:51:46','2025-04-08 17:51:46'),(5,'heyrong22@naver.com','heyrong22','00100','dc0bbae1-fda4-4819-b69d-4103d8caeac8','2025-04-09 02:54:40','2025-04-09 02:54:40'),(6,'rbflsms@qkqhek.com','rbflsms','00100','2372de25-59fc-4406-8a8c-e617e4105a33','2025-04-09 05:01:17','2025-04-09 05:01:17'),(7,'znjzk@qkqh.com','znjzk','00100','9910f499-e58b-42af-9de8-899ad3f3a4e6','2025-04-09 13:25:01','2025-04-09 13:25:01'),(8,'asdad@qkqh.com','asdad','00100','6e9532be-49ad-4905-aa2a-0ae41b17a91f','2025-04-10 12:05:42','2025-04-10 12:05:42'),(9,'dasda@qkqh.com','dasda','00100','2e36b0ef-f403-4812-990b-d7f6b3e166fa','2025-04-10 12:24:13','2025-04-10 12:24:13');
/*!40000 ALTER TABLE `financial_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `register_product`
--

DROP TABLE IF EXISTS `register_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `register_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_type_unique_no` varchar(255) NOT NULL,
  `bank_code` varchar(20) NOT NULL,
  `bank_name` varchar(100) NOT NULL,
  `account_type_code` varchar(50) NOT NULL,
  `account_type_name` varchar(100) NOT NULL,
  `account_name` varchar(100) NOT NULL,
  `account_description` text,
  `account_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `register_product`
--

LOCK TABLES `register_product` WRITE;
/*!40000 ALTER TABLE `register_product` DISABLE KEYS */;
INSERT INTO `register_product` VALUES (1,'020-1-f5b74047a04b4a','020','우리은행','1','수시입출금','우리은행 수시입출금 상품명','우리은행 수시입출금 상품설명','DOMESTIC'),(2,'999-1-dc42d6724b1042','999','싸피은행','1','수시입출금','싸피은행 수시입출금 상품명','싸피은행 수시입출금 상품설명','DOMESTIC'),(3,'088-1-b114c4b7f62b49','088','신한은행','1','수시입출금','신한은행 수시입출금 상품명','신한은행 수시입출금 상품설명','DOMESTIC'),(4,'088-1-d369bf47170246','088','신한은행','1','수시입출금','신한은행 수시입출금 상품명','신한은행 수시입출금 상품설명','DOMESTIC'),(5,'020-1-e76a11ded74f4c','020','우리은행','1','수시입출금','우리은행 수시입출금 상품명','우리은행 수시입출금 상품설명','DOMESTIC'),(6,'999-1-abb94d98416b42','999','싸피은행','1','수시입출금','싸피은행 수시입출금 상품명','싸피은행 수시입출금 상품설명','DOMESTIC'),(7,'999-1-0fe9c833bb2941','999','싸피은행','1','수시입출금','싸피은행 수시입출금 상품명','싸피은행 수시입출금 상품설명','DOMESTIC'),(8,'020-1-d1070c55205f44','020','우리은행','1','수시입출금','우리은행 수시입출금 상품명','우리은행 수시입출금 상품설명','DOMESTIC'),(9,'020-1-c1d1050af99a44','020','우리은행','1','수시입출금','우리은행 수시입출금 상품명','우리은행 수시입출금 상품설명','DOMESTIC');
/*!40000 ALTER TABLE `register_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `simple_password`
--

DROP TABLE IF EXISTS `simple_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `simple_password` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `encoded_password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `simple_password_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `keywi`.`users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `simple_password`
--

LOCK TABLES `simple_password` WRITE;
/*!40000 ALTER TABLE `simple_password` DISABLE KEYS */;
INSERT INTO `simple_password` VALUES (1,9,'$2a$10$gw21L3uXmCr0YgV3E17MauiRl0SGgayOJjWnCs2cObQAh4bgidT7C','2025-04-08 14:52:27','2025-04-09 22:31:56'),(2,12,'$2a$10$qlZiPBJr2nYE01Tmty2lIegrKIyh22xLFkBdyHpGpDjc8AdeY4pjG','2025-04-08 22:47:28','2025-04-08 22:47:28'),(3,14,'$2a$10$Ghv27sSBKhwEqxPhn5mAYOXeZMypdbTBQ/q2JXjhYg6.F57TWiYXG','2025-04-09 00:38:55','2025-04-10 01:10:43'),(4,10,'$2a$10$QggGjccNH6xOyWlVhYEH0eZryeY6fwbntdTjcMHwPn2SSxIh1ZscG','2025-04-10 11:22:56','2025-04-10 11:22:56'),(5,13,'$2a$10$0705NubC3jEtHUBaza82/elgzhlBq3vpORofWZWpuEJbpt4uYd6I.','2025-04-10 14:56:16','2025-04-10 14:56:16'),(6,1,'$2a$10$3wQJrzzPwAXJb4Ye53HqPeRIvyy4jJ4cL.vPeXEG21MQxRmZ81peC','2025-04-10 22:17:57','2025-04-10 22:17:57'),(7,4,'$2a$10$S1oToGmG3L8qRuN61DpJAeuZ3Uuue0RwV8WbgOxEOxRzXkHD1WJ92','2025-04-10 22:36:26','2025-04-11 10:44:38'),(8,5,'$2a$10$2PulSR0D0lt0V2V2k/VcBO4GPus/sh/oPZyS/epGexPDMJ5VkqpVm','2025-04-11 03:23:09','2025-04-11 03:23:09'),(9,3,'$2a$10$.RYqcQXYNvR0hbylAJEhDuLV.aMxBbAMzpjBWOObAJ71eogszbeeC','2025-04-11 03:39:24','2025-04-11 09:51:20');
/*!40000 ALTER TABLE `simple_password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account_connection`
--

DROP TABLE IF EXISTS `user_account_connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_account_connection` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `demand_account_id` bigint NOT NULL,
  `connected_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`demand_account_id`),
  KEY `demand_account_id` (`demand_account_id`),
  CONSTRAINT `user_account_connection_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `keywi`.`users` (`user_id`),
  CONSTRAINT `user_account_connection_ibfk_2` FOREIGN KEY (`demand_account_id`) REFERENCES `demand_deposit_account` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account_connection`
--

LOCK TABLES `user_account_connection` WRITE;
/*!40000 ALTER TABLE `user_account_connection` DISABLE KEYS */;
INSERT INTO `user_account_connection` VALUES (2,12,1,'2025-04-08 22:47:28'),(4,9,7,'2025-04-09 22:31:56'),(7,13,3,'2025-04-10 14:56:16'),(8,1,2,'2025-04-10 22:17:57'),(10,5,9,'2025-04-11 03:23:09'),(12,3,10,'2025-04-11 09:51:20'),(14,4,6,'2025-04-11 10:44:38');
/*!40000 ALTER TABLE `user_account_connection` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-11 17:39:37
