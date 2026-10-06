-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: gym_management
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `status` enum('Present','Absent') NOT NULL,
  PRIMARY KEY (`attendance_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `session_bookings` (`booking_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,1,'2026-10-07','Present'),(2,2,'2026-10-07','Present'),(3,3,'2026-10-07','Absent'),(4,3,'2026-10-07','Absent');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fitness_sessions`
--

DROP TABLE IF EXISTS `fitness_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fitness_sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `session_name` varchar(100) NOT NULL,
  `trainer_id` int NOT NULL,
  `session_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `fitness_sessions_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`trainer_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fitness_sessions`
--

LOCK TABLES `fitness_sessions` WRITE;
/*!40000 ALTER TABLE `fitness_sessions` DISABLE KEYS */;
INSERT INTO `fitness_sessions` VALUES (1,'Morning Strength Training',1,'2026-10-07','07:00:00','08:00:00',15),(2,'Yoga for Beginners',2,'2026-10-07','09:00:00','10:00:00',20),(3,'Weight Loss Workout',3,'2026-10-08','18:00:00','19:00:00',15),(4,'Advanced Strength Training',1,'2026-10-09','17:00:00','18:00:00',10);
/*!40000 ALTER TABLE `fitness_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `registration_date` date NOT NULL DEFAULT (curdate()),
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
INSERT INTO `members` VALUES (1,'Rahul Sharma','rahul@gmail.com','9876543210','Male','2004-05-12','2026-10-06','Active'),(2,'Priya Reddy','priya@gmail.com','9876543211','Female','2003-08-21','2026-10-06','Active'),(3,'Arjun Kumar','arjun@gmail.com','9876543212','Male','2002-11-15','2026-10-06','Active'),(4,'Sneha Rao','sneha@gmail.com','9876543213','Female','2004-02-10','2026-10-06','Active'),(5,'Karthik Varma','karthik@gmail.com','9876543214','Male','2003-06-18','2026-10-06','Inactive'),(6,'testmember','testmember@gmail.com','1234567890','Male','2008-01-28','2026-10-06','Active');
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_plans`
--

DROP TABLE IF EXISTS `membership_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(50) NOT NULL,
  `duration_months` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  UNIQUE KEY `plan_name` (`plan_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_plans`
--

LOCK TABLES `membership_plans` WRITE;
/*!40000 ALTER TABLE `membership_plans` DISABLE KEYS */;
INSERT INTO `membership_plans` VALUES (1,'Monthly',1,1500.00,'One month gym membership'),(2,'Quarterly',3,4000.00,'Three month gym membership'),(3,'Half Yearly',6,7000.00,'Six month gym membership'),(4,'Yearly',12,12000.00,'One year gym membership');
/*!40000 ALTER TABLE `membership_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberships`
--

DROP TABLE IF EXISTS `memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memberships` (
  `membership_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `plan_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('Paid','Pending') DEFAULT 'Pending',
  PRIMARY KEY (`membership_id`),
  KEY `member_id` (`member_id`),
  KEY `plan_id` (`plan_id`),
  CONSTRAINT `memberships_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `memberships_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plans` (`plan_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberships`
--

LOCK TABLES `memberships` WRITE;
/*!40000 ALTER TABLE `memberships` DISABLE KEYS */;
INSERT INTO `memberships` VALUES (1,1,2,'2026-09-01','2026-11-30',4000.00,'Paid'),(2,2,4,'2026-08-15','2027-08-14',12000.00,'Paid'),(3,3,1,'2026-10-01','2026-10-31',1500.00,'Paid'),(4,4,3,'2026-07-01','2026-12-31',7000.00,'Paid'),(5,5,1,'2026-05-01','2026-05-31',1500.00,'Pending'),(6,6,4,'2026-10-15','2026-10-31',12000.00,'Pending');
/*!40000 ALTER TABLE `memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_bookings`
--

DROP TABLE IF EXISTS `session_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `session_id` int NOT NULL,
  `booking_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `booking_status` enum('Booked','Cancelled') DEFAULT 'Booked',
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `member_id` (`member_id`,`session_id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `session_bookings_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `session_bookings_ibfk_2` FOREIGN KEY (`session_id`) REFERENCES `fitness_sessions` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_bookings`
--

LOCK TABLES `session_bookings` WRITE;
/*!40000 ALTER TABLE `session_bookings` DISABLE KEYS */;
INSERT INTO `session_bookings` VALUES (1,1,1,'2026-10-06 15:08:34','Booked'),(2,2,2,'2026-10-06 15:08:34','Booked'),(3,3,1,'2026-10-06 15:08:34','Booked'),(4,4,3,'2026-10-06 15:08:34','Booked'),(5,1,4,'2026-10-06 15:08:34','Booked');
/*!40000 ALTER TABLE `session_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainers`
--

DROP TABLE IF EXISTS `trainers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trainers` (
  `trainer_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `experience_years` int DEFAULT '0',
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`trainer_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainers`
--

LOCK TABLES `trainers` WRITE;
/*!40000 ALTER TABLE `trainers` DISABLE KEYS */;
INSERT INTO `trainers` VALUES (1,'Vikram Singh','vikram@gym.com','9000000001','Strength Training',5,'Active'),(2,'Ananya Mehta','ananya@gym.com','9000000002','Yoga and Flexibility',4,'Active'),(3,'Rohit Kapoor','rohit@gym.com','9000000003','Weight Loss',6,'Active'),(4,'Sathvik','abc@gmail.com','0987654321','Calisthenics',2,'Active');
/*!40000 ALTER TABLE `trainers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07  3:04:05
