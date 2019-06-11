-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema smart_lighting
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema smart_lighting
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `smart_lighting` DEFAULT CHARACTER SET utf8 ;
USE `smart_lighting` ;

-- -----------------------------------------------------
-- Table `smart_lighting`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smart_lighting`.`account` (
  `user_id` INT(10) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `fullname` VARCHAR(100) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `birthday` DATE NULL DEFAULT NULL,
  `isRoot` ENUM('T', 'F') NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `smart_lighting`.`home`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smart_lighting`.`home` (
  `home_id` INT(10) NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NOT NULL,
  `home_name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`home_id`),
  CONSTRAINT `fk_home_account1`
    FOREIGN KEY (`user_id`)
    REFERENCES `smart_lighting`.`account` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `smart_lighting`.`room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smart_lighting`.`room` (
  `room_id` INT(10) NOT NULL AUTO_INCREMENT,
  `home_id` INT(10) NOT NULL,
  `room_name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  CONSTRAINT `fk_room_home1`
    FOREIGN KEY (`home_id`)
    REFERENCES `smart_lighting`.`home` (`home_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `smart_lighting`.`device`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smart_lighting`.`device` (
  `device_id` INT(10) NOT NULL,
  `room_id` INT(10) NOT NULL,
  `device_type` VARCHAR(45) NOT NULL,
  `device_name` VARCHAR(45) NOT NULL,
  `mac_address` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`device_id`),
  CONSTRAINT `fk_device_room1`
    FOREIGN KEY (`room_id`)
    REFERENCES `smart_lighting`.`room` (`room_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `smart_lighting`.`lighting_device`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smart_lighting`.`lighting_device` (
  `device_id` INT(10) NOT NULL,
  `luminance_value` VARCHAR(45) NULL DEFAULT NULL,
  `luminance_percentage` FLOAT(4,1) NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `power_usage` VARCHAR(45) NULL DEFAULT NULL,
  `time` DATETIME NOT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  CONSTRAINT `fk_lighting_device_device1`
    FOREIGN KEY (`device_id`)
    REFERENCES `smart_lighting`.`device` (`device_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `smart_lighting`.`luminance_sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `smart_lighting`.`luminance_sensor` (
  `device_id` INT(10) NOT NULL,
  `luminance_value` VARCHAR(45) NULL DEFAULT NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `time` DATETIME NOT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  CONSTRAINT `fk_luminance_sensor_device1`
    FOREIGN KEY (`device_id`)
    REFERENCES `smart_lighting`.`device` (`device_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
