-- DROP DATABASE IF EXISTS `note`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS `note`;
-- Database creation
CREATE DATABASE IF NOT EXISTS `note`;
USE `note`;


-- User: The user that will be used to connect to the database by the front and back end
DROP USER IF EXISTS 'note'@'%';
CREATE USER 'note'@'%' IDENTIFIED BY 'note';
GRANT ALL PRIVILEGES ON note.* TO 'note'@'%';
FLUSH PRIVILEGES;


-- TABLES
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `note` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `type` ENUM('text', 'list') NOT NULL DEFAULT 'text',
  `pinned` BOOLEAN NOT NULL DEFAULT 0 CHECK (`pinned` IN (0, 1)),
  `public` BOOLEAN NOT NULL DEFAULT 0 CHECK (`public` IN (0, 1)),
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `text_note_content` (
  `note_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY (`note_id`),
  FOREIGN KEY (`note_id`) REFERENCES `note`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `list_note_content` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `item` TEXT,
  `position` INT NOT NULL,
  `checked` BOOLEAN NOT NULL DEFAULT 0 CHECK (`checked` IN (0, 1)),
  `note_id` INT NOT NULL,
  FOREIGN KEY (`note_id`) REFERENCES `note`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


COMMIT;
