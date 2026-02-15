-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 15, 2026 at 11:30 AM
-- Server version: 8.4.7
-- PHP Version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `business_listing_rating`
--

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
CREATE TABLE IF NOT EXISTS `businesses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `total_ratings` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`id`, `name`, `address`, `phone`, `email`, `created_at`, `updated_at`, `average_rating`, `total_ratings`) VALUES
(1, 'Sunrise Cafeeee', '123 Main Street, New York, NY', '7896541236', 'contaact@sunrisecafe.com', '2026-02-14 07:45:47', NULL, 3.30, 5),
(2, 'TechNova Solutions', '456 Market Street, San Francisco, CA', '415-555-2002', 'info@technova.com', '2026-02-14 07:45:47', NULL, 3.30, 2),
(3, 'GreenLeaf Grocery', '789 Oak Avenue, Austin, TX', '512-555-3003', 'support@greenleaf.com', '2026-02-14 07:45:47', NULL, 3.20, 3),
(4, 'BlueWave Fitness', '321 Ocean Drive, Miami, FL', '305-555-4004', 'hello@bluewavefit.com', '2026-02-14 07:45:47', NULL, 3.20, 3),
(5, 'Bright Smile Dental', '654 Elm Street, Chicago, IL', '312-555-5005', 'appointments@brightsmile.com', '2026-02-14 07:45:47', NULL, 2.80, 3),
(38, 'Cafe Coffee Day', '123 Main Street, New York, NY', '741852963', 'ccd@gmail.com', '2026-02-15 11:16:19', NULL, 2.50, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `business_id` bigint NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` decimal(2,1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`business_id`,`email`),
  UNIQUE KEY `unique_phone` (`business_id`,`phone`)
) ;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `business_id`, `name`, `email`, `phone`, `rating`, `created_at`, `updated_at`) VALUES
(1, 1, 'Urvashi', 'u@gmail.com', '1111111111', 4.5, '2026-02-14 18:09:59', '2026-02-14 18:14:11'),
(2, 1, 'John Doe', 'johnd@gmail.com', '7895412635', 3.5, '2026-02-14 18:45:51', '2026-02-14 18:45:51'),
(3, 31, 'John Doe', 'johnd@gmail.com', '7895412635', 5.0, '2026-02-15 03:44:33', '2026-02-15 03:45:35'),
(4, 1, 'John Doe', 'johndoe@gmail.com', '7895412735', 3.5, '2026-02-15 03:50:18', '2026-02-15 03:57:44'),
(5, 31, 'John Doe', 'johndoe@gmail.com', '7895412735', 3.0, '2026-02-15 04:05:45', '2026-02-15 04:06:59'),
(6, 31, 'kjhdfgh', 'confsrtdct@sorisecafe.com', '212-555-1400', 4.0, '2026-02-15 04:08:37', '2026-02-15 04:08:37'),
(7, 1, 'hsd', 'confsrtdct@sorisecafe.com', '212-555-1400', 2.5, '2026-02-15 04:11:40', '2026-02-15 10:28:50'),
(8, 2, 'John Doe', 'confsrtdct@sorisecafe.com', '212-555-1400', 3.5, '2026-02-15 04:38:32', '2026-02-15 06:50:43'),
(9, 4, 'kjhdfgh', 'confsrtdct@sorisecafe.com', '212-555-1400', 3.5, '2026-02-15 05:06:35', '2026-02-15 05:06:35'),
(10, 3, 'kjhdfgh', 'confsrtdct@sorisecafe.com', '212-555-1400', 3.5, '2026-02-15 05:06:43', '2026-02-15 05:06:43'),
(11, 5, 'kjhdfgh', 'confsrtdct@sorisecafe.com', '212-555-1400', 1.5, '2026-02-15 05:06:50', '2026-02-15 05:06:50'),
(12, 32, 'John Doe', 'dt@t.cosse', '212-555-1400', 3.5, '2026-02-15 06:33:49', '2026-02-15 06:33:49'),
(13, 2, 'Johnny Doey', 'dt@t.coxsse', '2125541400', 3.0, '2026-02-15 06:51:54', '2026-02-15 06:51:54'),
(14, 3, 'Johnny Doey', 'dta@t.coxsse', '2145541400', 2.5, '2026-02-15 06:56:29', '2026-02-15 06:56:29'),
(15, 3, 'Johnny Doey', 'dsta@t.coxsse', '2175541400', 3.5, '2026-02-15 06:58:21', '2026-02-15 06:58:21'),
(16, 4, 'Johnny Doey', 'dspta@t.coxsse', '2175544400', 3.5, '2026-02-15 07:02:31', '2026-02-15 07:05:09'),
(17, 5, 'Johnny Doey', 'dspta@t.coxsse', '2175544400', 3.5, '2026-02-15 07:04:27', '2026-02-15 07:04:27'),
(18, 5, 'Johnny Doey', 'dsppta@t.coxsse', '2175554400', 3.5, '2026-02-15 07:07:02', '2026-02-15 07:07:02'),
(19, 4, 'Johnny Doey', 'dysppta@t.coxsse', '2175574400', 2.5, '2026-02-15 07:09:51', '2026-02-15 09:59:10'),
(20, 1, 'Johnny Doey', 'dysppta@t.coxsse', '2175574400', 2.5, '2026-02-15 07:20:54', '2026-02-15 10:00:33'),
(21, 38, 'hssss', 'confsrtdct@sorisecafe.com', '212-555-1400', 2.5, '2026-02-15 11:16:57', '2026-02-15 11:16:57');

--
-- Triggers `ratings`
--
DROP TRIGGER IF EXISTS `trg_rating_after_insert`;
DELIMITER $$
CREATE TRIGGER `trg_rating_after_insert` AFTER INSERT ON `ratings` FOR EACH ROW BEGIN
    UPDATE businesses
    SET 
        average_rating = (
            SELECT IFNULL(AVG(rating), 0)
            FROM ratings
            WHERE business_id = NEW.business_id
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM ratings
            WHERE business_id = NEW.business_id
        )
    WHERE id = NEW.business_id;
END
$$
DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
