-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pyfood
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (5,'น้ำจิ้ม'),(4,'น้ำพริก'),(1,'หมู'),(3,'หมูผสมไก่'),(2,'ไก่');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price_per_unit` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_orders_idx` (`order_id`),
  KEY `fk_order_items_products_idx` (`product_id`),
  CONSTRAINT `fk_order_items_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_items_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=407 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,2,34,2,250.00),(3,2,48,2,40.00),(4,2,54,2,60.00),(7,4,33,2,170.00),(8,5,36,2,35.00),(9,6,38,2,320.00),(11,8,33,1,170.00),(12,8,41,2,250.00),(13,9,36,7,35.00),(14,10,33,2,170.00),(15,11,33,1,170.00),(16,12,33,2,170.00),(17,13,36,1,35.00),(18,14,37,2,250.00),(19,14,43,2,25.00),(20,14,53,1,2500.00),(21,15,53,1,2500.00),(22,16,35,2,210.00),(23,17,33,1,170.00),(24,18,33,2,170.00),(25,19,33,2,170.00),(26,20,33,1,170.00),(27,21,38,3,320.00),(29,22,34,1,250.00),(30,22,44,2,60.00),(31,23,41,2,250.00),(32,24,34,2,250.00),(33,25,33,2,170.00),(34,26,38,2,320.00),(35,27,33,3,170.00),(36,28,37,2,250.00),(37,29,39,2,30.00),(38,30,36,2,35.00),(39,31,46,2,210.00),(40,32,36,2,35.00),(41,33,44,2,60.00),(42,34,34,2,250.00),(43,35,34,1,250.00),(44,36,39,1,30.00),(45,37,33,2,170.00),(46,38,36,2,35.00),(47,39,38,2,320.00),(48,40,37,2,250.00),(50,42,40,1,4000.00),(51,43,35,2,210.00),(52,44,39,2,30.00),(53,45,48,1,40.00),(54,46,52,2,4000.00),(55,46,41,1,250.00),(56,46,66,1,170.00),(57,47,38,2,320.00),(61,49,36,1,35.00),(62,50,48,2,40.00),(63,50,54,1,60.00),(64,50,34,2,250.00),(65,51,46,1,210.00),(66,52,49,2,4950.00),(67,53,40,1,4000.00),(68,54,36,1,35.00),(69,54,41,2,250.00),(70,55,42,1,2500.00),(71,55,42,1,2500.00),(72,55,44,2,60.00),(73,56,54,2,60.00),(74,56,42,1,2500.00),(77,58,43,2,25.00),(80,60,36,2,35.00),(81,60,33,1,170.00),(82,60,35,1,210.00),(83,61,34,1,250.00),(84,62,44,1,60.00),(85,62,53,2,2500.00),(86,63,48,1,40.00),(87,63,50,1,7950.00),(88,64,46,1,210.00),(89,64,41,2,250.00),(92,66,47,1,170.00),(93,66,34,1,250.00),(94,66,45,2,270.00),(95,67,44,2,60.00),(96,67,37,1,250.00),(97,68,43,1,25.00),(98,69,54,2,60.00),(99,70,35,2,210.00),(100,70,44,2,60.00),(101,70,46,1,210.00),(102,71,52,1,4000.00),(103,72,33,2,170.00),(104,72,42,1,2500.00),(105,73,48,2,40.00),(106,73,41,1,250.00),(107,74,66,2,170.00),(108,75,48,1,40.00),(109,76,48,2,40.00),(110,76,36,2,35.00),(111,77,41,2,250.00),(112,77,49,1,4950.00),(115,79,38,2,320.00),(116,79,49,1,4950.00),(117,80,54,1,60.00),(121,83,48,2,40.00),(122,83,54,2,60.00),(123,84,48,1,40.00),(124,84,47,2,170.00),(125,84,51,1,6150.00),(126,85,36,2,35.00),(127,85,53,2,2500.00),(128,85,36,1,35.00),(131,87,40,2,4000.00),(132,87,43,1,25.00),(133,87,38,2,320.00),(134,88,43,2,25.00),(135,89,33,1,170.00),(136,89,47,1,170.00),(137,90,53,2,2500.00),(138,90,53,1,2500.00),(139,91,48,2,40.00),(140,91,35,1,210.00),(141,92,35,2,210.00),(142,92,45,2,270.00),(143,93,44,1,60.00),(144,94,33,1,170.00),(145,94,54,1,60.00),(146,95,54,1,60.00),(147,95,36,2,35.00),(151,97,40,1,4000.00),(152,98,44,1,60.00),(153,98,51,1,6150.00),(154,99,49,1,4950.00),(155,99,54,2,60.00),(156,99,35,2,210.00),(157,100,44,2,60.00),(158,101,36,2,35.00),(159,101,40,1,4000.00),(160,101,47,1,170.00),(161,102,52,1,4000.00),(162,102,52,1,4000.00),(163,102,47,2,170.00),(164,103,42,1,2500.00),(165,103,40,1,4000.00),(169,105,42,1,2500.00),(170,106,37,1,250.00),(171,107,38,2,320.00),(172,107,50,1,7950.00),(173,107,45,1,270.00),(174,108,35,1,210.00),(175,108,45,2,270.00),(176,108,66,1,170.00),(177,109,47,1,170.00),(178,109,41,1,250.00),(179,110,66,1,170.00),(180,110,34,1,250.00),(181,111,43,2,25.00),(182,111,51,1,6150.00),(183,111,46,1,210.00),(184,112,40,1,4000.00),(185,112,34,1,250.00),(186,112,45,1,270.00),(187,113,49,1,4950.00),(188,114,34,2,250.00),(189,115,37,2,250.00),(192,117,52,1,4000.00),(193,117,49,1,4950.00),(194,118,51,1,6150.00),(195,119,45,1,270.00),(196,119,36,2,35.00),(197,119,66,1,170.00),(198,120,40,2,4000.00),(199,121,43,1,25.00),(200,121,48,2,40.00),(201,121,52,1,4000.00),(202,122,48,1,40.00),(203,122,46,1,210.00),(204,123,53,1,2500.00),(205,123,33,1,170.00),(206,124,44,1,60.00),(207,124,34,1,250.00),(208,124,39,2,30.00),(209,125,39,2,30.00),(210,126,33,1,170.00),(211,126,52,1,4000.00),(213,128,47,1,170.00),(214,129,37,2,250.00),(218,131,41,1,250.00),(219,131,48,2,40.00),(223,133,34,1,250.00),(224,133,45,2,270.00),(225,133,34,1,250.00),(226,134,37,2,250.00),(227,134,40,1,4000.00),(228,135,47,1,170.00),(229,135,54,1,60.00),(230,135,66,1,170.00),(231,136,39,1,30.00),(232,136,39,2,30.00),(233,136,50,1,7950.00),(234,137,48,1,40.00),(235,137,66,2,170.00),(236,137,54,1,60.00),(237,138,46,1,210.00),(238,138,49,1,4950.00),(239,138,43,1,25.00),(240,139,48,1,40.00),(241,140,33,2,170.00),(242,140,35,1,210.00),(243,140,53,2,2500.00),(244,141,39,1,30.00),(245,141,46,1,210.00),(246,141,50,1,7950.00),(247,142,53,2,2500.00),(248,142,48,1,40.00),(249,142,33,2,170.00),(250,143,38,2,320.00),(251,143,47,1,170.00),(252,143,35,1,210.00),(253,144,40,2,4000.00),(254,145,46,2,210.00),(255,145,37,2,250.00),(256,145,53,1,2500.00),(257,146,36,2,35.00),(258,146,47,2,170.00),(259,147,42,2,2500.00),(262,149,36,1,35.00),(263,149,41,1,250.00),(264,149,66,2,170.00),(265,150,49,1,4950.00),(266,151,40,2,4000.00),(267,152,43,2,25.00),(268,152,39,2,30.00),(269,152,52,2,4000.00),(270,153,36,2,35.00),(271,153,36,2,35.00),(272,154,48,2,40.00),(273,154,50,1,7950.00),(274,154,48,2,40.00),(275,155,37,1,250.00),(279,157,41,2,250.00),(283,159,37,1,250.00),(284,160,46,2,210.00),(285,160,34,2,250.00),(286,160,43,2,25.00),(287,161,66,1,170.00),(288,161,33,2,170.00),(289,162,45,1,270.00),(290,162,52,2,4000.00),(291,163,36,2,35.00),(292,164,48,1,40.00),(293,165,39,2,30.00),(294,165,45,2,270.00),(295,165,44,1,60.00),(296,166,48,1,40.00),(297,167,33,2,170.00),(298,168,47,1,170.00),(299,168,52,2,4000.00),(300,168,47,1,170.00),(301,169,66,1,170.00),(302,169,52,1,4000.00),(303,169,48,2,40.00),(304,170,36,1,35.00),(305,170,46,2,210.00),(306,170,54,2,60.00),(307,171,48,1,40.00),(308,172,39,2,30.00),(309,172,43,2,25.00),(310,173,34,2,250.00),(311,173,43,2,25.00),(312,173,39,2,30.00),(313,174,51,1,6150.00),(314,174,47,1,170.00),(315,175,38,1,320.00),(316,176,35,1,210.00),(317,176,53,2,2500.00),(318,177,54,1,60.00),(319,177,66,1,170.00),(320,177,66,2,170.00),(321,178,54,2,60.00),(322,178,45,1,270.00),(323,178,35,2,210.00),(324,179,42,2,2500.00),(325,179,49,1,4950.00),(326,180,47,1,170.00),(327,180,44,2,60.00),(328,180,42,1,2500.00),(329,181,38,2,320.00),(330,182,45,2,270.00),(331,182,36,1,35.00),(332,182,34,2,250.00),(336,184,35,2,210.00),(337,184,54,2,60.00),(338,185,47,1,170.00),(342,187,53,2,2500.00),(346,189,52,2,4000.00),(347,190,39,1,30.00),(348,191,38,2,320.00),(349,191,49,1,4950.00),(350,191,48,1,40.00),(351,192,33,1,170.00),(355,194,33,2,170.00),(356,194,34,2,250.00),(357,194,36,2,35.00),(358,195,33,1,170.00),(359,195,34,1,250.00),(360,195,35,1,210.00),(361,195,36,1,35.00),(362,195,39,1,30.00),(363,195,41,1,250.00),(364,195,43,1,25.00),(365,195,44,1,60.00),(366,195,45,1,270.00),(367,195,46,1,210.00),(368,195,47,1,170.00),(369,195,48,1,40.00),(370,195,54,1,60.00),(371,195,66,1,170.00),(372,196,33,2,170.00),(373,196,34,2,250.00),(374,197,33,2,170.00),(375,198,34,3,250.00),(376,199,34,2,250.00),(377,199,35,2,210.00),(378,200,33,4,170.00),(379,200,34,1,250.00),(380,200,35,1,210.00),(381,200,36,2,35.00),(382,200,37,1,250.00),(383,200,39,1,30.00),(384,200,41,1,250.00),(385,200,43,1,25.00),(386,201,34,1,250.00),(387,201,36,1,35.00),(388,201,41,1,250.00),(389,201,43,1,25.00),(390,201,47,1,170.00),(391,202,33,1,170.00),(392,202,39,1,30.00),(393,202,41,1,250.00),(394,203,33,2,170.00),(395,203,36,1,35.00),(396,204,33,1,170.00),(397,204,39,1,30.00),(398,205,33,2,170.00),(399,206,36,1,35.00),(400,207,33,3,170.00),(401,207,34,2,250.00),(402,208,33,1,170.00),(403,208,36,1,35.00),(404,209,33,1,170.00),(405,210,33,5,170.00),(406,211,54,1,60.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_address_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_status` varchar(50) DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `payment_slip_url` varchar(255) DEFAULT NULL,
  `shipping_carrier` varchar(100) DEFAULT NULL,
  `tracking_code` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_users_idx` (`user_id`),
  KEY `fk_orders_user_addresses_idx` (`user_address_id`),
  CONSTRAINT `fk_orders_user_addresses` FOREIGN KEY (`user_address_id`) REFERENCES `user_addresses` (`id`),
  CONSTRAINT `fk_orders_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=212 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,2,2,1210.00,'Cancelled',NULL,'2025-10-16 08:53:49','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760676825/pyfood/cfnps6yedkksgoupl5pi.jpg',NULL,NULL),(3,2,2,1190.00,'Completed',NULL,'2025-09-15 03:30:00',NULL,NULL,NULL),(4,2,2,680.00,'Completed',NULL,'2025-09-22 07:15:00',NULL,NULL,NULL),(5,2,2,70.00,'Completed',NULL,'2025-08-05 02:12:00',NULL,NULL,NULL),(6,2,2,640.00,'payment_rejected',NULL,'2025-10-16 17:49:31','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760728612/pyfood/nmw0fwuhhui2e07ldft1.png',NULL,NULL),(7,2,2,170.00,'Completed',NULL,'2025-08-18 04:45:00','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760643083/pyfood/sxxdom5b6ndqs3g3fyky.jpg',NULL,NULL),(8,2,2,670.00,'payment_rejected',NULL,'2025-10-17 09:13:06','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760778386/pyfood/k5guojk4skufp1smffzt.png',NULL,NULL),(9,2,3,245.00,'Cancelled',NULL,'2025-10-17 09:14:29','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760692522/pyfood/q6skska0o6qujnji5lyn.png',NULL,NULL),(10,2,3,340.00,'Completed',NULL,'2025-08-25 09:30:00','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760695660/pyfood/czifdro2m2zjcizpcavs.jpg',NULL,NULL),(11,2,2,170.00,'Cancelled',NULL,'2025-10-17 18:55:48',NULL,NULL,NULL),(12,2,3,340.00,'payment_rejected',NULL,'2025-10-18 04:58:07','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760778218/pyfood/vmclxrahrqwurc9kggug.png',NULL,NULL),(13,2,2,35.00,'payment_rejected',NULL,'2025-10-18 09:09:03','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760778577/pyfood/ybzjy8njwpdcieamxp30.png',NULL,NULL),(14,2,2,3050.00,'Cancelled',NULL,'2025-07-10 11:00:00',NULL,NULL,NULL),(15,2,2,2500.00,'Cancelled',NULL,'2025-10-18 10:19:11',NULL,NULL,NULL),(16,2,2,420.00,'pending',NULL,'2025-07-20 03:20:00',NULL,NULL,NULL),(17,2,2,170.00,'pending',NULL,'2025-10-18 11:29:48',NULL,NULL,NULL),(18,2,2,340.00,'pending',NULL,'2025-07-28 06:00:00',NULL,NULL,NULL),(19,2,2,340.00,'pending',NULL,'2025-10-18 12:15:33',NULL,NULL,NULL),(20,2,2,170.00,'pending',NULL,'2025-10-18 13:14:10',NULL,NULL,NULL),(21,2,2,960.00,'Processing',NULL,'2025-06-30 08:00:00','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760807531/pyfood/fefxopntpzqojj9hshfe.png',NULL,NULL),(22,2,2,1560.00,'payment_rejected','card','2025-10-18 16:20:38',NULL,NULL,NULL),(23,2,2,500.00,'pending','card','2025-10-18 17:13:49',NULL,NULL,NULL),(24,2,2,500.00,'pending','cod','2025-10-18 17:14:06',NULL,NULL,NULL),(25,2,2,340.00,'Processing','cod','2025-10-18 17:38:55',NULL,NULL,NULL),(26,2,3,640.00,'Processing','cod','2025-10-18 17:55:12',NULL,NULL,NULL),(27,2,3,510.00,'Processing','cod','2025-10-18 17:55:52',NULL,NULL,NULL),(28,2,2,500.00,'awaiting_verification','bank_transfer','2025-10-18 18:05:47','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761018097/pyfood/veiultdnpdtcfmqoxvqd.png',NULL,NULL),(29,2,2,60.00,'Processing','cod','2025-10-18 18:06:27',NULL,NULL,NULL),(30,2,3,70.00,'Processing','cod','2025-10-18 18:06:50',NULL,NULL,NULL),(31,2,2,420.00,'Shipped','cod','2025-10-18 18:09:00',NULL,'kerry','TH01227MVTWB3B'),(32,2,2,70.00,'awaiting_verification','bank_transfer','2025-10-18 18:10:32','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761018086/pyfood/c4sy4avlcgzc63gk6eid.png',NULL,NULL),(33,2,2,120.00,'Shipped','cod','2025-10-18 18:10:56',NULL,NULL,NULL),(34,2,3,500.00,'Completed','cod','2025-10-18 18:14:02',NULL,NULL,NULL),(35,2,2,250.00,'Cancelled','bank_transfer','2025-10-18 18:20:55','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761018079/pyfood/tjv6vmbl7chmkffurtax.png',NULL,NULL),(36,2,2,30.00,'Completed','cod','2025-10-18 18:21:13',NULL,NULL,NULL),(37,2,2,340.00,'Completed','cod','2025-10-18 18:47:26',NULL,NULL,NULL),(38,2,2,70.00,'Cancelled','bank_transfer','2025-10-18 18:47:50',NULL,NULL,NULL),(39,2,2,640.00,'Completed','cod','2025-10-18 18:48:23',NULL,NULL,NULL),(40,2,3,500.00,'Completed','bank_transfer','2025-10-18 19:18:07','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760899746/pyfood/qskefiaierne2xrfgist.png',NULL,NULL),(41,2,2,75000.00,'Completed','bank_transfer','2025-10-19 16:53:57','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760892847/pyfood/twkqlmcyf55ml5bxlfnw.jpg',NULL,NULL),(42,2,2,4000.00,'Completed','bank_transfer','2025-10-19 18:49:21','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760899777/pyfood/qzcgbsmy2r7pzs7myvok.png',NULL,NULL),(43,2,2,420.00,'Completed','bank_transfer','2025-10-19 20:14:38','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760904887/pyfood/zjrblenwbl2wyui9p7re.png',NULL,NULL),(44,2,2,60.00,'Processing','bank_transfer','2025-09-21 04:16:04',NULL,NULL,NULL),(45,2,2,40.00,'Completed','cod','2025-08-22 04:16:04',NULL,NULL,NULL),(46,2,2,8420.00,'Completed','bank_transfer','2025-06-14 04:16:04',NULL,NULL,NULL),(47,2,2,640.00,'Processing','bank_transfer','2025-09-18 04:16:04',NULL,NULL,NULL),(48,2,2,13020.00,'Processing','bank_transfer','2025-10-17 04:16:04',NULL,NULL,NULL),(49,2,2,35.00,'Processing','cod','2025-07-14 04:16:04',NULL,NULL,NULL),(50,2,2,640.00,'Completed','bank_transfer','2025-09-29 04:16:04',NULL,NULL,NULL),(51,2,2,210.00,'Completed','cod','2025-05-02 04:16:04',NULL,NULL,NULL),(52,2,2,9900.00,'Processing','bank_transfer','2025-07-25 04:16:04',NULL,NULL,NULL),(53,2,2,4000.00,'Completed','cod','2025-08-06 04:16:04',NULL,NULL,NULL),(54,2,2,535.00,'Completed','bank_transfer','2025-06-13 04:16:04',NULL,NULL,NULL),(55,2,2,5120.00,'Completed','cod','2025-08-03 04:16:04',NULL,NULL,NULL),(56,2,2,2620.00,'Processing','bank_transfer','2025-09-29 04:16:04',NULL,NULL,NULL),(57,2,2,12800.00,'Completed','bank_transfer','2025-04-25 04:16:04',NULL,NULL,NULL),(58,2,2,50.00,'Completed','cod','2025-04-30 04:16:04',NULL,NULL,NULL),(59,2,2,16240.00,'Completed','cod','2025-08-21 04:16:04',NULL,NULL,NULL),(60,2,2,450.00,'Completed','cod','2025-04-30 04:16:04',NULL,NULL,NULL),(61,2,2,250.00,'Completed','cod','2025-08-07 04:16:05',NULL,NULL,NULL),(62,2,2,5060.00,'Completed','cod','2025-09-24 04:16:05',NULL,NULL,NULL),(63,2,2,7990.00,'Completed','bank_transfer','2025-08-03 04:16:05',NULL,NULL,NULL),(64,2,2,710.00,'Processing','cod','2025-09-04 04:16:05',NULL,NULL,NULL),(65,2,2,20900.00,'Completed','cod','2025-07-21 04:16:05',NULL,NULL,NULL),(66,2,2,960.00,'Completed','bank_transfer','2025-07-05 04:16:05',NULL,NULL,NULL),(67,2,2,370.00,'Processing','cod','2025-05-29 04:16:05',NULL,NULL,NULL),(68,2,2,25.00,'Completed','bank_transfer','2025-05-26 04:16:05',NULL,NULL,NULL),(69,2,2,120.00,'Completed','cod','2025-10-11 04:16:05',NULL,NULL,NULL),(70,2,2,750.00,'Completed','cod','2025-07-28 04:16:05',NULL,NULL,NULL),(71,2,2,4000.00,'Completed','bank_transfer','2025-06-07 04:16:05',NULL,NULL,NULL),(72,2,2,2840.00,'Processing','cod','2025-05-22 04:16:05',NULL,NULL,NULL),(73,2,2,330.00,'Completed','bank_transfer','2025-09-17 04:16:05',NULL,NULL,NULL),(74,2,2,340.00,'Completed','bank_transfer','2025-09-23 04:16:05',NULL,NULL,NULL),(75,2,2,40.00,'Completed','cod','2025-06-28 04:16:05',NULL,NULL,NULL),(76,2,2,150.00,'Completed','bank_transfer','2025-05-12 04:16:05',NULL,NULL,NULL),(77,2,2,5450.00,'Completed','cod','2025-10-15 04:16:05',NULL,NULL,NULL),(78,2,2,15960.00,'Completed','bank_transfer','2025-08-24 04:16:05',NULL,NULL,NULL),(79,2,2,5590.00,'Completed','cod','2025-05-31 04:16:05',NULL,NULL,NULL),(80,2,2,60.00,'Completed','bank_transfer','2025-07-15 04:16:05',NULL,NULL,NULL),(81,2,2,12300.00,'Completed','cod','2025-10-19 04:16:05',NULL,NULL,NULL),(82,2,2,12720.00,'Completed','cod','2025-06-21 04:16:05',NULL,NULL,NULL),(83,2,2,200.00,'Processing','bank_transfer','2025-06-06 04:16:05',NULL,NULL,NULL),(84,2,2,6530.00,'Completed','cod','2025-06-23 04:16:05',NULL,NULL,NULL),(85,2,2,5105.00,'Processing','cod','2025-09-11 04:16:05',NULL,NULL,NULL),(86,2,2,12720.00,'Processing','cod','2025-08-29 04:16:05',NULL,NULL,NULL),(87,2,2,8665.00,'Processing','cod','2025-07-04 04:16:05',NULL,NULL,NULL),(88,2,2,50.00,'Processing','bank_transfer','2025-06-26 04:16:05',NULL,NULL,NULL),(89,2,2,340.00,'Completed','cod','2025-06-04 04:16:05',NULL,NULL,NULL),(90,2,2,7500.00,'Processing','bank_transfer','2025-10-08 04:16:05',NULL,NULL,NULL),(91,2,2,290.00,'Processing','cod','2025-05-30 04:16:05',NULL,NULL,NULL),(92,2,2,960.00,'Completed','cod','2025-04-30 04:16:05',NULL,NULL,NULL),(93,2,2,60.00,'Processing','cod','2025-09-28 04:16:05',NULL,NULL,NULL),(94,2,2,230.00,'Completed','bank_transfer','2025-08-06 04:19:20',NULL,NULL,NULL),(95,2,2,130.00,'Processing','bank_transfer','2025-04-03 04:19:20',NULL,NULL,NULL),(96,2,2,12220.00,'Processing','cod','2025-07-23 04:19:20',NULL,NULL,NULL),(97,2,2,4000.00,'Completed','cod','2025-04-19 04:19:20',NULL,NULL,NULL),(98,2,2,6210.00,'Completed','cod','2025-01-23 04:19:20',NULL,NULL,NULL),(99,2,2,5490.00,'Completed','cod','2025-08-13 04:19:20',NULL,NULL,NULL),(100,2,2,120.00,'Completed','cod','2024-11-24 04:19:20',NULL,NULL,NULL),(101,2,2,4240.00,'Completed','cod','2025-06-28 04:19:20',NULL,NULL,NULL),(102,2,2,8340.00,'Completed','bank_transfer','2024-12-13 04:19:20',NULL,NULL,NULL),(103,2,2,6500.00,'Completed','cod','2025-09-28 04:19:20',NULL,NULL,NULL),(104,2,2,16340.00,'Completed','cod','2025-06-14 04:19:20',NULL,NULL,NULL),(105,2,2,2500.00,'Completed','cod','2025-04-25 04:19:20',NULL,NULL,NULL),(106,2,2,250.00,'Processing','cod','2025-04-07 04:19:20',NULL,NULL,NULL),(107,2,2,8860.00,'Completed','cod','2025-09-15 04:19:20',NULL,NULL,NULL),(108,2,2,920.00,'Completed','cod','2025-05-27 04:19:20',NULL,NULL,NULL),(109,2,2,420.00,'Completed','cod','2025-06-20 04:19:20',NULL,NULL,NULL),(110,2,2,420.00,'Completed','cod','2025-01-05 04:19:20',NULL,NULL,NULL),(111,2,2,6410.00,'Completed','bank_transfer','2025-06-11 04:19:20',NULL,NULL,NULL),(112,2,2,4520.00,'Completed','bank_transfer','2025-01-28 04:19:20',NULL,NULL,NULL),(113,2,2,4950.00,'Processing','cod','2025-03-12 04:19:20',NULL,NULL,NULL),(114,2,2,500.00,'Completed','cod','2025-03-08 04:19:20',NULL,NULL,NULL),(115,2,2,500.00,'Completed','cod','2024-12-09 04:19:20',NULL,NULL,NULL),(116,2,2,12380.00,'Completed','bank_transfer','2025-08-10 04:19:20',NULL,NULL,NULL),(117,2,2,8950.00,'Processing','bank_transfer','2024-10-31 04:19:20',NULL,NULL,NULL),(118,2,2,6150.00,'Processing','cod','2025-01-11 04:19:20',NULL,NULL,NULL),(119,2,2,510.00,'Completed','cod','2025-03-28 04:19:20',NULL,NULL,NULL),(120,2,2,8000.00,'Completed','cod','2025-05-10 04:19:20',NULL,NULL,NULL),(121,2,2,4105.00,'Completed','cod','2024-12-16 04:19:20',NULL,NULL,NULL),(122,2,2,250.00,'Completed','bank_transfer','2025-07-23 04:19:20',NULL,NULL,NULL),(123,2,2,2670.00,'Processing','cod','2025-05-30 04:19:20',NULL,NULL,NULL),(124,2,2,370.00,'Completed','bank_transfer','2025-05-06 04:19:20',NULL,NULL,NULL),(125,2,2,60.00,'Processing','cod','2025-03-29 04:19:20',NULL,NULL,NULL),(126,2,2,4170.00,'Completed','cod','2024-11-13 04:19:20',NULL,NULL,NULL),(127,2,2,15900.00,'Completed','cod','2025-01-15 04:19:20',NULL,NULL,NULL),(128,2,2,170.00,'Completed','bank_transfer','2025-08-07 04:19:20',NULL,NULL,NULL),(129,2,2,500.00,'Completed','bank_transfer','2025-05-28 04:19:20',NULL,NULL,NULL),(130,2,2,10510.00,'Completed','cod','2025-02-18 04:19:20',NULL,NULL,NULL),(131,2,2,330.00,'Completed','bank_transfer','2024-11-21 04:19:20',NULL,NULL,NULL),(132,2,2,21400.00,'Processing','cod','2025-01-01 04:19:21',NULL,NULL,NULL),(133,2,2,1040.00,'Completed','bank_transfer','2025-04-12 04:19:21',NULL,NULL,NULL),(134,2,2,4500.00,'Processing','cod','2024-10-25 04:19:21',NULL,NULL,NULL),(135,2,2,400.00,'Completed','cod','2025-07-20 04:19:21',NULL,NULL,NULL),(136,2,2,8040.00,'Completed','bank_transfer','2025-01-12 04:19:21',NULL,NULL,NULL),(137,2,2,440.00,'Completed','cod','2025-05-23 04:19:21',NULL,NULL,NULL),(138,2,2,5185.00,'Completed','bank_transfer','2024-11-15 04:19:21',NULL,NULL,NULL),(139,2,2,40.00,'Processing','bank_transfer','2025-04-12 04:19:21',NULL,NULL,NULL),(140,2,2,5550.00,'Completed','cod','2025-01-21 04:19:21',NULL,NULL,NULL),(141,2,2,8190.00,'Processing','cod','2024-11-27 04:19:21',NULL,NULL,NULL),(142,2,2,5380.00,'Completed','bank_transfer','2024-10-24 04:19:21',NULL,NULL,NULL),(143,2,2,1020.00,'Completed','bank_transfer','2025-09-11 04:19:21',NULL,NULL,NULL),(144,2,2,8000.00,'Completed','bank_transfer','2025-02-06 04:19:21',NULL,NULL,NULL),(145,2,2,3420.00,'Completed','bank_transfer','2025-08-22 04:19:21',NULL,NULL,NULL),(146,2,2,410.00,'Processing','bank_transfer','2025-04-05 04:19:21',NULL,NULL,NULL),(147,2,2,5000.00,'Completed','bank_transfer','2025-03-16 04:19:21',NULL,NULL,NULL),(148,2,2,17300.00,'Completed','cod','2025-09-02 04:19:21',NULL,NULL,NULL),(149,2,2,625.00,'Processing','bank_transfer','2025-02-06 04:19:21',NULL,NULL,NULL),(150,2,2,4950.00,'Completed','bank_transfer','2025-09-21 04:19:21',NULL,NULL,NULL),(151,2,2,8000.00,'Processing','cod','2025-02-27 04:19:21',NULL,NULL,NULL),(152,2,2,8110.00,'Completed','cod','2024-12-22 04:19:21',NULL,NULL,NULL),(153,2,2,140.00,'Completed','bank_transfer','2024-11-22 04:19:21',NULL,NULL,NULL),(154,2,2,8110.00,'Processing','cod','2024-11-09 04:19:21',NULL,NULL,NULL),(155,2,2,250.00,'Completed','cod','2024-12-28 04:19:21',NULL,NULL,NULL),(156,2,2,13120.00,'Completed','bank_transfer','2025-04-06 04:19:21',NULL,NULL,NULL),(157,2,2,500.00,'Processing','bank_transfer','2025-08-21 04:19:21',NULL,NULL,NULL),(158,2,2,16135.00,'Completed','cod','2025-08-30 04:19:21',NULL,NULL,NULL),(159,2,2,250.00,'Completed','cod','2025-06-29 04:19:21',NULL,NULL,NULL),(160,2,2,970.00,'Completed','cod','2025-09-27 04:19:21',NULL,NULL,NULL),(161,2,2,510.00,'Completed','cod','2025-05-02 04:19:21',NULL,NULL,NULL),(162,2,2,8270.00,'Completed','cod','2025-09-10 04:19:21',NULL,NULL,NULL),(163,2,2,70.00,'Processing','cod','2025-09-02 04:19:21',NULL,NULL,NULL),(164,2,2,40.00,'Processing','cod','2025-08-01 04:19:21',NULL,NULL,NULL),(165,2,2,660.00,'Processing','bank_transfer','2025-01-03 04:19:21',NULL,NULL,NULL),(166,2,2,40.00,'Completed','cod','2025-10-13 04:19:21',NULL,NULL,NULL),(167,2,2,340.00,'Processing','bank_transfer','2025-07-29 04:19:21',NULL,NULL,NULL),(168,2,2,8340.00,'Processing','cod','2025-04-27 04:19:21',NULL,NULL,NULL),(169,2,2,4250.00,'Completed','bank_transfer','2025-09-15 04:19:21',NULL,NULL,NULL),(170,2,2,575.00,'Completed','bank_transfer','2025-05-02 04:19:21',NULL,NULL,NULL),(171,2,2,40.00,'Completed','cod','2025-09-07 04:19:21',NULL,NULL,NULL),(172,2,2,110.00,'Completed','bank_transfer','2025-07-04 04:19:21',NULL,NULL,NULL),(173,2,2,610.00,'Processing','cod','2025-05-03 04:19:21',NULL,NULL,NULL),(174,2,2,6320.00,'Processing','cod','2025-04-01 04:19:21',NULL,NULL,NULL),(175,2,2,320.00,'Completed','bank_transfer','2025-03-09 04:19:21',NULL,NULL,NULL),(176,2,2,5210.00,'Completed','cod','2025-09-19 04:19:21',NULL,NULL,NULL),(177,2,2,570.00,'Completed','bank_transfer','2025-01-14 04:19:21',NULL,NULL,NULL),(178,2,2,810.00,'Completed','bank_transfer','2025-05-20 04:19:21',NULL,NULL,NULL),(179,2,2,9950.00,'Processing','bank_transfer','2025-08-19 04:19:21',NULL,NULL,NULL),(180,2,2,2790.00,'Completed','cod','2025-10-15 04:19:21',NULL,NULL,NULL),(181,2,2,640.00,'Completed','bank_transfer','2025-03-12 04:19:21',NULL,NULL,NULL),(182,2,2,1075.00,'Completed','cod','2025-06-22 04:19:21',NULL,NULL,NULL),(183,2,2,10070.00,'Processing','bank_transfer','2025-08-30 04:19:21',NULL,NULL,NULL),(184,2,2,540.00,'Completed','bank_transfer','2025-03-15 04:19:21',NULL,NULL,NULL),(185,2,2,170.00,'Processing','bank_transfer','2025-06-03 04:19:21',NULL,NULL,NULL),(186,2,2,16400.00,'Completed','bank_transfer','2025-09-24 04:19:21',NULL,NULL,NULL),(187,2,2,5000.00,'Completed','cod','2025-08-03 04:19:21',NULL,NULL,NULL),(188,2,2,18450.00,'Completed','cod','2024-11-10 04:19:21',NULL,NULL,NULL),(189,2,2,8000.00,'Completed','bank_transfer','2025-07-07 04:19:21',NULL,NULL,NULL),(190,2,2,30.00,'Completed','cod','2025-03-08 04:19:22',NULL,NULL,NULL),(191,2,2,5630.00,'Completed','cod','2025-02-23 04:19:22',NULL,NULL,NULL),(192,2,2,170.00,'Processing','cod','2025-10-13 04:19:22',NULL,NULL,NULL),(193,2,2,25240.00,'Completed','bank_transfer','2025-10-05 04:19:22',NULL,NULL,NULL),(194,2,2,910.00,'Completed','bank_transfer','2025-10-20 11:03:01','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760958191/pyfood/pnx5n7pqmdxv8dchek4q.png',NULL,NULL),(195,2,2,1950.00,'Cancelled','bank_transfer','2025-10-20 16:52:44',NULL,NULL,NULL),(196,2,2,840.00,'Completed','bank_transfer','2025-10-21 03:57:15','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761019048/pyfood/m2hstxvs700bxshnnf1p.png',NULL,NULL),(197,2,2,340.00,'Shipped','bank_transfer','2025-10-21 08:48:06','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761106058/pyfood/pi8lhzikdugax1fqbcde.jpg','kerry','TH01227MVTWB3B'),(198,2,3,750.00,'Cancelled','bank_transfer','2025-10-21 10:08:32','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761041332/pyfood/vgi1p2vs5phvdi7zvqno.jpg',NULL,NULL),(199,2,2,920.00,'Cancelled','bank_transfer','2025-10-21 19:06:00','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761073572/pyfood/vwon2kmvxhcoemruvf2b.jpg',NULL,NULL),(200,2,2,1765.00,'Cancelled','bank_transfer','2025-10-21 19:45:24',NULL,NULL,NULL),(201,2,2,730.00,'Cancelled','bank_transfer','2025-10-21 19:46:38',NULL,NULL,NULL),(202,2,2,450.00,'Cancelled','bank_transfer','2025-10-21 19:48:13',NULL,NULL,NULL),(203,2,2,375.00,'pending','bank_transfer','2025-10-21 19:51:21',NULL,NULL,NULL),(204,2,2,250.00,'pending','bank_transfer','2025-10-21 20:05:30',NULL,NULL,NULL),(205,2,2,390.00,'pending','bank_transfer','2025-10-21 20:05:45',NULL,NULL,NULL),(206,2,2,85.00,'pending','bank_transfer','2025-10-21 20:05:56',NULL,NULL,NULL),(207,2,2,1060.00,'Cancelled','bank_transfer','2025-10-22 02:55:38',NULL,NULL,NULL),(208,2,2,255.00,'Completed','bank_transfer','2025-10-22 04:01:25','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761105703/pyfood/oaytsnbqrngemwldym2k.jpg','flash','TH01227MVTWB3B'),(209,2,3,220.00,'pending','bank_transfer','2025-10-29 21:39:46',NULL,NULL,NULL),(210,2,3,900.00,'Completed','bank_transfer','2025-10-30 00:45:53','https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761785162/pyfood/qempmi2movb81szhwon8.jpg','flash','TH01227MVTWB3B'),(211,2,3,110.00,'pending','bank_transfer','2025-10-30 02:02:00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `category_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`category_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_types`
--

DROP TABLE IF EXISTS `product_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
INSERT INTO `product_types` VALUES (3,'กระปุก'),(4,'ขวด'),(6,'ถุง'),(5,'ลัง'),(2,'แผง'),(1,'แพ็ค');
/*!40000 ALTER TABLE `product_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL DEFAULT '0',
  `image_url` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `bestseller` tinyint(1) DEFAULT '0',
  `category_id` int DEFAULT NULL,
  `product_type_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fk_products_product_types_idx` (`product_type_id`),
  CONSTRAINT `fk_products_product_types` FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (33,'โอชา ไก่หยองเบเกอรี่','ไก่หยองเบเกอรี่โอชา ขนาดบรรจุ 1,000 กรัม\r\nเหมาะสำหรับทำเบเกอรี่ต่างๆ รสชาติออกหวาน',170.00,78,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521075/pyfood/xxm9o53su2ccfimnxnjc.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521075/pyfood/xxm9o53su2ccfimnxnjc.png\"]','[\"1000\"]',0,NULL,1,'2025-10-15 09:37:52',1),(34,'โอชา หมูหยองแผง ( หมูผสมไก่ ) แบบ 5 แผง','หมูหยองแผง ตรา โอชา  1 แผงมี 12 ซอง\r\nขนาดบรรจุซองละ 7 กรัม (หมูผสมไก่)\r\nหมูหยองอย่างดี เหมาะสำหรับทานเล่น ทานกับข้าว\r\nรสชาติกลมกล่อม เส้นฟูกรอบ ทานได้ทุกวัย',250.00,91,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521176/pyfood/kcyeuw2s4til9tfvrpuq.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521176/pyfood/kcyeuw2s4til9tfvrpuq.png\"]','[\"865\"]',1,NULL,2,'2025-10-15 09:39:32',1),(35,'โอชา หมูหยองอย่างดี ( หมูผสมไก่ )','หมูหยองอย่างดี ขนาดบรรจุ 500 กรัม แบบ ( หมูผสมไก่ )\r\nเหมาะสำหรับทานเล่น ทานกับข้าวรสชาติกลมกล่อม เส้นฟูกรอบ ทานได้ทุกวัย',210.00,97,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521521/pyfood/prryy5n11bktsehahaig.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521521/pyfood/prryy5n11bktsehahaig.png\"]','[\"500\"]',0,NULL,1,'2025-10-15 09:45:17',1),(36,'น้ำจิ้มลูกชิ้น (สูตรมะขาม) ตรา โอชา แบบถุง','น้ำจิ้มลูกชิ้น (สูตรมะขาม) ตรา โอชา แบบถุง 1,000 กรัม ได้รับการันตีจาก  เปิบพิสดาร  ยืนยันในความอร่อยเลิสรส',35.00,94,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521701/pyfood/evepdcnvmoo5vhydcyub.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760521701/pyfood/evepdcnvmoo5vhydcyub.png\"]','[\"1000\"]',0,NULL,6,'2025-10-15 09:48:17',1),(37,'โอชา ไก่หยองแผง 5 แผง','ไก่หยองแผง ตรา โอชา 1 แผงมี 12 ซอง\r\n\r\nขนาดบรรจุซองละ 7 กรัม\r\n\r\nเหมาะสำหรับทานเล่น ทานกับข้าว รสชาติกลมกล่อม\r\n\r\nเส้นฟูกรอบ ทานได้ทุกวัย เก็บรักษาได้นาน',250.00,99,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522475/pyfood/fbiim41ceosavwqr70dx.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522475/pyfood/fbiim41ceosavwqr70dx.png\"]','[\"10\"]',0,NULL,2,'2025-10-15 10:01:11',1),(38,'จิ้มลูกชิ้น (สูตรมะขาม) ตรา โอชา แบบลัง 10ถุง','น้ำจิ้มลูกชิ้น (สูตรมะขาม) ตรา โอชา\r\nจำนวน 1 ลัง/ 10ถุง แบบถุง 1,000 กรัม (ถุงละ 32 บาท) \r\nได้รับการันตีจาก \" เปิบพิสดาร \" ยืนยันในความอร่อยเลิสรส\r\nจุดสังเกตุตราโลโก้ เปิบพิสดาร บนถุงบรรจุ',320.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522707/pyfood/i4ejzm9wu9d67bqxc3rq.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522707/pyfood/i4ejzm9wu9d67bqxc3rq.png\"]','[\"10000\"]',0,NULL,6,'2025-10-15 10:05:04',1),(39,'โอชา น้ำพริกเผา ( ได้รับการรับรองจากฮาลาล )','น้ำพริกเผาโอชา ขนาดบรรจุ 500 กรัม\r\n\r\nเหมาะสำหรับทำเบเกอรี่ ไส้ขนมต่างๆ\r\n\r\nรสชาติกลมกล่อม',30.00,97,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522796/pyfood/dphjaixktkh2lznrnv4v.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522796/pyfood/dphjaixktkh2lznrnv4v.png\"]','[\"500\"]',0,NULL,6,'2025-10-15 10:06:33',1),(40,'โอชา หมูหยองเบเกอรี่ ( หมูผสมไก่ ) แบบลัง 25 ถุง','ราคานี้คือราคาต่อ 1 ลัง นะคะ\r\n\r\nใน 1 ลังมีทั้งหมด 25 ถุง\r\n\r\nบรรจุถุงละ 1000 กรัม\r\n\r\nหมูหยองเบเกอรี่โอชา แบบ (หมูผสมไก่)\r\n\r\nเหมาะสำหรับทำเบเกอรี่ต่างๆ รสชาติออกหวาน',4000.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522898/pyfood/h8o3e8wf2wyrtgdpsjjc.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760522898/pyfood/h8o3e8wf2wyrtgdpsjjc.png\"]','[\"26200\"]',0,NULL,5,'2025-10-15 10:08:14',1),(41,'โอชา น้ำพริกหมูหยอง ( หมูผสมไก่ ) 1 แพ็ค 10 ซอง','น้ำพริกหมูหยองขนาดบรรจุ 50 กรัม (หมูผสมไก่)\r\n\r\nเหมาะสำหรับโรยกับข้าวสวยร้อนๆ\r\n\r\nหรือจะทานเล่นก็เพลิน รสชาติกลมกล่อม\r\n\r\nเผ็ดเล็กน้อย',250.00,97,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523155/pyfood/jqh3avuua87lkdspmjhf.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523155/pyfood/jqh3avuua87lkdspmjhf.png\"]','[\"50\"]',0,NULL,1,'2025-10-15 10:12:31',1),(42,'โอชา หมูหยองลัง ( หมูผสมไก่ ) 50 แผง 1 ลัง','หมูหยองแผง ตรา โอชา (หมูผสมไก่)  แบบลัง\r\nใน 1 แผงมี 12 ซอง ขนาดบรรจุ 7 กรัมต่อ 1 ซอง',2500.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523322/pyfood/aq600nlltjt8bakkjj3l.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523322/pyfood/aq600nlltjt8bakkjj3l.png\"]','[\"10500\"]',0,NULL,5,'2025-10-15 10:15:18',1),(43,'น้ำจิ้มลูกชิ้น (สูตรมะขาม) ตรา โอชา แบบขวด','น้ำจิ้มลูกชิ้น (สูตรมะขาม) ตรา โอชา  แบบขวด 220 กรัม',25.00,98,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523509/pyfood/qahzeflmf0w3u9hecuov.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523509/pyfood/qahzeflmf0w3u9hecuov.png\"]','[\"220\"]',0,NULL,4,'2025-10-15 10:18:25',1),(44,'น้ำพริกหมูหยอง(หมูผสมไก่) 100 กรัม ตรา โอชา (เปิบพิสดาร)','น้ำพริกหมูหยองขนาดบรรจุ 100 กรัม (หมูผสมไก่)\r\n\r\n\"การันตี โดย เปิบพิสดาร\"\r\n\r\nเหมาะสำหรับโรยกับข้าวสวยร้อนๆ หรือจะทานเล่นก็เพลิน\r\n\r\nรสชาติกลมกล่อม เผ็ดเล็กน้อย',60.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523818/pyfood/sjuktinoz9trvezozxsx.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523818/pyfood/sjuktinoz9trvezozxsx.png\"]','[\"100\"]',0,NULL,3,'2025-10-15 10:23:34',1),(45,'โอชา หมูหยองอย่างดี ( หมูล้วน )','หมูหยองอย่างดี ขนาดบรรจุ 500 กรัม แบบ ( หมูล้วน )\r\nรสชาติกลมกล่อม เส้นฟูกรอบ ทานได้ทุกวัย',270.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523904/pyfood/ccwsxmrs9g3f8wjpylqz.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523904/pyfood/ccwsxmrs9g3f8wjpylqz.png\"]','[\"500\"]',0,NULL,1,'2025-10-15 10:25:00',1),(46,'โอชา น้ำพริกหมูหยอง ( หมูผสมไก่ )','น้ำพริกหมูหยองขนาดบรรจุ 500 กรัม (หมูผสมไก่)\r\n\r\nเหมาะสำหรับโรยกับข้าวสวยร้อนๆ หรือจะทานเล่นก็เพลิน\r\n\r\nรสชาติกลมกล่อม เผ็ดเล็กน้อย',210.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523981/pyfood/ukifsjcxi7wvwdmuar84.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760523981/pyfood/ukifsjcxi7wvwdmuar84.png\"]','[\"500\"]',0,NULL,1,'2025-10-15 10:26:17',1),(47,'โอชา หมูหยองอย่างดี ( หมูผสมไก่ )','หมูหยองอย่างดี ขนาดบรรจุ 170 กรัม (หมูผสมไก่)\r\n\r\nเหมาะสำหรับทานเล่น ทานกับข้าว รสชาติกลมกล่อม\r\n\r\nเส้นฟูกรอบ ทานได้ทุกวัย',170.00,99,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524072/pyfood/t3kcs59rok356emho1ff.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524072/pyfood/t3kcs59rok356emho1ff.png\"]','[\"200\"]',0,NULL,1,'2025-10-15 10:27:48',1),(48,'โอชา หมูหยองจาน ( หมูผสมไก่ )','หมูหยองอย่างดี ขนาดบรรจุ 50 กรัม (หมูผสมไก่)\r\n\r\nเหมาะสำหรับทานเล่น ทานกับข้าว รสชาติกลมกล่อม\r\n\r\nเส้นฟูกรอบ',40.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524134/pyfood/lijwkrwfle5vjjvih5di.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524134/pyfood/lijwkrwfle5vjjvih5di.png\"]','[\"50\"]',0,NULL,3,'2025-10-15 10:28:50',1),(49,'โอชา น้ำพริกหมูหยอง ( หมูผสมไก่ ) แบบลัง 30 ถุง','1 ลังมีทั้งหมด 30 ถุง\r\n\r\nบรรจุถุงละ 500 กรัม\r\n\r\nน้ำพริกหมูหยอง แบบ (หมูผสมไก่)\r\n\r\nเหมาะสำหรับโรยกับข้าวสวยร้อนๆ หรือจะทานเล่นก็เพลิน\r\n\r\nรสชาติกลมกล่อม เผ็ดเล็กน้อย',4950.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524242/pyfood/ztyghgpcabvwptzymqsr.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524242/pyfood/ztyghgpcabvwptzymqsr.png\"]','[\"16200\"]',0,NULL,5,'2025-10-15 10:30:38',1),(50,'โอชา หมูหยองอย่างดี ( หมูล้วน ) แบบลัง 30 ถุง','ใน 1 ลังมีทั้งหมด 30 ถุง\r\n\r\nบรรจุถุงละ 500 กรัม\r\n\r\nหมูหยองอย่างดี แบบ ( หมูล้วน )',7950.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524659/pyfood/vv3igzpm9jeoe151yrly.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524390/pyfood/nufmrkz9x8ualpjl6muh.png\"]','[\"16200\"]',0,NULL,5,'2025-10-15 10:33:07',1),(51,'โอชา หมูหยองอย่างดี ( หมูผสมไก่ ) แบบลัง 30 ถุง','ใน 1 ลังมีทั้งหมด 30 ถุง\r\n\r\nบรรจุถุงละ 500 กรัม\r\n\r\nหมูหยองอย่างดี แบบ ( หมูผสมไก่ )',6150.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524635/pyfood/qotlwt5c9kec5nhzmzuh.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524635/pyfood/qotlwt5c9kec5nhzmzuh.png\"]','[\"16200\"]',0,NULL,5,'2025-10-15 10:37:11',1),(52,'โอชา ไก่หยองเบเกอรี่ แบบลัง 25 ถุง','ใน 1 ลังมีทั้งหมด 25 ถุง\r\n\r\nบรรจุถุงละ 1000 กรัม\r\n\r\nไก่หยองเบเกอรี่โอชา\r\n\r\nเหมาะสำหรับทำเบเกอรี่ต่างๆ รสชาติออกหวาน',4000.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524742/pyfood/h9dnw2jmwzoj0cfg4ajj.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760524742/pyfood/h9dnw2jmwzoj0cfg4ajj.png\"]','[\"26200\"]',0,NULL,5,'2025-10-15 10:38:59',1),(53,'โอชา ไก่หยองลัง 50 แผง','1 ลัง มีทั้งหมด 50 แผง\r\n\r\nไก่หยองแผง ตรา โอชา \r\n\r\n1 แผงมี 12 ซอง ขนาดบรรจุ 7 กรัมต่อ 1 ซอง\r\n\r\nเหมาะสำหรับทานเล่น ทานกับข้าว รสชาติกลมกล่อม\r\n\r\nเส้นฟูกรอบ',2500.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760525059/pyfood/joqzhsb3xgmpv3ijzuik.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760525059/pyfood/joqzhsb3xgmpv3ijzuik.png\"]','[\"10500\"]',0,NULL,5,'2025-10-15 10:44:15',1),(54,'โอชา น้ำพริกหมูหยอง ( หมูผสมไก่ )','น้ำพริกหมูหยองขนาดบรรจุ 100 กรัม (หมูผสมไก่)\r\n\r\nเหมาะสำหรับโรยกับข้าวสวยร้อนๆ หรือจะทานเล่นก็เพลิน\r\n\r\nรสชาติกลมกล่อม เผ็ดเล็กน้อย',60.00,99,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760525131/pyfood/r4kswhi8hcvdrhumfk6v.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760525131/pyfood/r4kswhi8hcvdrhumfk6v.png\"]','[\"100\"]',0,NULL,3,'2025-10-15 10:45:27',1),(66,'โอชา หมูหยองเบเกอรี่ ( หมูผสมไก่ )','หมูหยองเบเกอรี่โอชา ขนาดบรรจุ 1,000 กรัม (หมูผสมไก่)\r\n\r\nเหมาะสำหรับทำเบเกอรี่ต่างๆ รสชาติออกหวาน',170.00,100,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760805854/pyfood/cdu7zitmye0bx2tudaih.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1760805854/pyfood/cdu7zitmye0bx2tudaih.png\"]','[\"1000\"]',0,NULL,1,'2025-10-18 16:44:12',1),(70,'qwert','qwert',111.00,11,'https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761106284/pyfood/uxlp0mwvnwlgiduszloh.png','[\"https://res.cloudinary.com/dmnzsdlfj/image/upload/v1761106284/pyfood/uxlp0mwvnwlgiduszloh.png\"]','[\"123\"]',0,NULL,1,'2025-10-22 04:11:25',1),(71,'test','test',111.00,111,NULL,'[]','[\"[\\\"111\\\"]\"]',0,1,1,'2025-11-02 07:46:34',1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) NOT NULL,
  `sub_district` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `house_number` varchar(50) NOT NULL,
  `road` varchar(100) DEFAULT NULL,
  `alley` varchar(100) DEFAULT NULL,
  `village_number` varchar(50) DEFAULT NULL,
  `address_details` text,
  `is_default` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_user_addresses_users_idx` (`user_id`),
  CONSTRAINT `fk_user_addresses_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
INSERT INTO `user_addresses` VALUES (2,2,'สหชล','กิจสมัย','0812345678','กรุงเทพมหานคร','บางเขน','อนุสาวรีย์','10220','123/45',NULL,NULL,NULL,NULL,0),(3,2,'สมศรี','กิจสมัย','0812345678','กรุงเทพมหานคร','บางเขน','อนุสาวรีย์','10220','123/45','','',NULL,'',1);
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cartData` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ice Sa','icesa-new@example.com','$2b$10$85YowBxgceM.1B3WmxxKFO2Tx0LUVRv2ByAzg70uqlgAdjMv7rX9m',NULL,NULL,NULL,'2025-10-12 11:37:16','{}'),(2,'ice','ice@gmail.com','$2b$10$VhpLFqIqfv.NHvF87lETUO83Ayu4db5eopsBz6Th.GZoXtpFn.uQm',NULL,NULL,NULL,'2025-10-12 11:54:45','{}'),(3,'somchai','somchai@gmail.com','$2b$10$ZB8sGOPqJBp2obkHMRaQseRe.75gVA8EhWKxc5FG/Em2lyG03V5Pu',NULL,NULL,NULL,'2025-10-16 10:05:18','{}'),(4,'test','test@gmail.com','$2b$10$IfL4bvF14wzXeFRqzx3R3OTXTXvJjcAY6OzdJfM4AlovupMoKhDcK',NULL,NULL,NULL,'2025-10-21 20:11:35','{}'),(9,'somsee','somsee@gmail.com','$2b$10$NrRlAkEqXTjnOLdkAvRrsut0fuk6M9LAEu0R09djRN8H7NBdleSSW',NULL,NULL,NULL,'2025-10-21 20:12:26','{}'),(14,'somsuk','somsuk@gmail.com','$2b$10$fxSl/aikgxjsNu6QLdUg8OVmwkqLmqkAwHKovfHyjWyyWixnrQRfi',NULL,NULL,NULL,'2025-10-30 00:44:49','{}'),(15,'somsom','somsom@gmail.com','$2b$10$Sqc.MMkW2hJyFLrVs7p6eeFpnX6gGoB4090nl2281YVP1fPSKAjKK',NULL,NULL,NULL,'2025-10-30 00:45:09','{}');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-02 14:47:26
