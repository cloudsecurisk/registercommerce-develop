-- MySQL dump 10.13  Distrib 8.0.26, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: registercommerce
-- ------------------------------------------------------
-- Server version	5.7.35

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
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idCountry` int(10) unsigned NOT NULL,
  `idState` int(10) unsigned DEFAULT NULL,
  `idCity` int(10) unsigned DEFAULT NULL,
  `street` varchar(200) NOT NULL,
  `suburb` varchar(45) DEFAULT NULL,
  `zipCode` varchar(45) NOT NULL,
  `exteriorNumber` varchar(45) NOT NULL,
  `interiorNumber` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  `exteriorNumberStatus` int(11) NOT NULL DEFAULT '1',
  `interiorNumberStatus` int(11) NOT NULL DEFAULT '1',
  `streetStatus` int(11) NOT NULL DEFAULT '1',
  `zipCodeStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `address_country_idx` (`idCountry`),
  KEY `address_state_idx` (`idState`),
  KEY `address_city_idx` (`idCity`),
  CONSTRAINT `address_city` FOREIGN KEY (`idCity`) REFERENCES `cities` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `address_country` FOREIGN KEY (`idCountry`) REFERENCES `countries` (`id`),
  CONSTRAINT `address_state` FOREIGN KEY (`idState`) REFERENCES `states` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `idState` int(11) unsigned NOT NULL COMMENT 'Relación con estados.id',
  `clave` varchar(3) NOT NULL COMMENT 'Cve_Mun – Clave del municipio',
  `name` varchar(100) NOT NULL COMMENT 'Nom_Mun – Nombre del municipio',
  PRIMARY KEY (`id`),
  KEY `state` (`idState`),
  CONSTRAINT `cities_states` FOREIGN KEY (`idState`) REFERENCES `states` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2470 DEFAULT CHARSET=utf8 COMMENT='Tabla de Municipios de la Republica Mexicana';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commerceDocument`
--

DROP TABLE IF EXISTS `commerceDocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commerceDocument` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idCommerce` int(10) unsigned NOT NULL,
  `isValidated` tinyint(4) DEFAULT '0',
  `accountStatement` varchar(200) NOT NULL,
  `proofAddress` varchar(200) NOT NULL,
  `legalOwnerIdentification` varchar(200) NOT NULL,
  `proofFiscalSituation` varchar(200) DEFAULT NULL,
  `SATComplianceOpinion` varchar(200) DEFAULT NULL,
  `constitutiveAct` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commerceType`
--

DROP TABLE IF EXISTS `commerceType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commerceType` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commerces`
--

DROP TABLE IF EXISTS `commerces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commerces` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idUser` int(10) DEFAULT NULL,
  `idCommerceType` int(10) unsigned DEFAULT NULL,
  `idLineBusiness` int(10) unsigned DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_commerceType_commerce_idx` (`idCommerceType`),
  KEY `fk_lineOfBusiness_commerce_idx` (`idLineBusiness`),
  CONSTRAINT `fk_commerceType_commerce` FOREIGN KEY (`idCommerceType`) REFERENCES `commerceType` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_lineOfBusiness_commerce` FOREIGN KEY (`idLineBusiness`) REFERENCES `lineBusiness` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(2) NOT NULL,
  `name` varchar(90) NOT NULL,
  `citizenship` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=252 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `financialInformation`
--

DROP TABLE IF EXISTS `financialInformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financialInformation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idCommerce` int(10) unsigned DEFAULT NULL,
  `isValidated` tinyint(4) DEFAULT '0',
  `month1` varchar(45) DEFAULT NULL,
  `month2` varchar(45) DEFAULT NULL,
  `month3` varchar(45) DEFAULT NULL,
  `totalCash` varchar(45) DEFAULT NULL,
  `totalPos` varchar(45) DEFAULT NULL,
  `totalEcommerce` varchar(45) DEFAULT NULL,
  `averagePerMonth` varchar(45) DEFAULT NULL,
  `averagePerTransaction` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_commerce_ financialInformation_idx` (`idCommerce`),
  CONSTRAINT `FK_commerce_ financialInformation` FOREIGN KEY (`idCommerce`) REFERENCES `commerces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `generalInfo`
--

DROP TABLE IF EXISTS `generalInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generalInfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idCommerce` int(10) unsigned NOT NULL,
  `idCity` int(10) unsigned DEFAULT NULL,
  `idAddress` int(10) unsigned DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `commerceName` varchar(100) NOT NULL,
  `rfc` varchar(45) DEFAULT NULL,
  `socialReason` varchar(100) NOT NULL,
  `contract` varchar(200) DEFAULT NULL,
  `nameStatus` tinyint(4) DEFAULT '0',
  `lastNameStatus` tinyint(4) DEFAULT '0',
  `emailStatus` tinyint(4) DEFAULT '0',
  `phoneStatus` tinyint(4) DEFAULT '0',
  `commerceNameStatus` tinyint(4) DEFAULT '0',
  `rfcStatus` tinyint(4) DEFAULT '0',
  `webPage` varchar(100) NOT NULL,
  `webPageStatus` tinyint(4) DEFAULT '0',
  `socialReasonStatus` tinyint(4) DEFAULT '0',
  `contractStatus` tinyint(4) DEFAULT '0',
  `dailyLimit` int(100) unsigned NOT NULL DEFAULT '5000',
  `dailyLimitStatus` tinyint(4) DEFAULT '0',
  `monthlyLimit` int(100) unsigned NOT NULL DEFAULT '20000',
  `monthlyLimitStatus` tinyint(4) DEFAULT '0',
  `transactionLimit` int(100) DEFAULT '2000',
  `clabe` varchar(18) NOT NULL,
  `actNumber` varchar(45) DEFAULT NULL,
  `registrationDate` varchar(45) DEFAULT NULL,
  `notaryNumber` varchar(45) DEFAULT NULL,
  `nameOfTheNotary` varchar(45) DEFAULT NULL,
  `numeroCatastro` varchar(45) DEFAULT NULL,
  `clabeStatus` tinyint(4) DEFAULT '0',
  `beneficiaryName` varchar(45) DEFAULT NULL,
  `isValidated` varchar(45) DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCommerce_UNIQUE` (`idCommerce`),
  UNIQUE KEY `commerceName_UNIQUE` (`commerceName`),
  UNIQUE KEY `webPage_UNIQUE` (`webPage`),
  KEY `generalDocuments_commerce_idx` (`idCommerce`),
  KEY `generalInfo_city_idx` (`idCity`),
  KEY `generalInfo_address_idx` (`idAddress`),
  CONSTRAINT `generalDocuments_commerce` FOREIGN KEY (`idCommerce`) REFERENCES `commerces` (`id`),
  CONSTRAINT `generalInfo_address` FOREIGN KEY (`idAddress`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `generalInfo_city` FOREIGN KEY (`idCity`) REFERENCES `cities` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `legalRepresentative`
--

DROP TABLE IF EXISTS `legalRepresentative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legalRepresentative` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idCommerce` int(10) unsigned DEFAULT NULL,
  `idMaritalStatus` int(10) unsigned DEFAULT NULL,
  `idAddress` int(11) unsigned DEFAULT NULL,
  `idOfificialDocument` int(10) unsigned DEFAULT NULL,
  `isValidated` tinyint(4) DEFAULT '0',
  `name` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `motherLastName` varchar(45) DEFAULT NULL,
  `birthday` varchar(45) DEFAULT NULL,
  `RFC` varchar(45) DEFAULT NULL,
  `CURP` varchar(45) DEFAULT NULL,
  `oficialDocumentNumber` varchar(45) DEFAULT NULL,
  `validity` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_address_legalRepresentative_idx` (`idAddress`),
  KEY `FK_maritalStatus_legalRepresentative_idx` (`idMaritalStatus`),
  KEY `FK_commerce_legalRepresentative_idx` (`idCommerce`),
  CONSTRAINT `FK_address_legalRepresentative` FOREIGN KEY (`idAddress`) REFERENCES `addresses` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_commerce_legalRepresentative` FOREIGN KEY (`idCommerce`) REFERENCES `commerces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_maritalStatus_legalRepresentative` FOREIGN KEY (`idMaritalStatus`) REFERENCES `maritalStatus` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `lineBusiness`
--

DROP TABLE IF EXISTS `lineBusiness`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lineBusiness` (
  `id` int(10) unsigned NOT NULL,
  `lineBussinessBanorte` int(10) DEFAULT NULL,
  `CNBV` int(10) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL,
  `idCNBV` bigint(20) DEFAULT NULL,
  `idLineBussinessBanorte` bigint(20) DEFAULT NULL,
  `idBanorte` bigint(20) DEFAULT NULL,
  `keyBankSpei` bigint(20) DEFAULT NULL,
  `keyCecoban` varchar(255) DEFAULT NULL,
  `speua` varchar(255) DEFAULT NULL,
  `tef` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maritalStatus`
--

DROP TABLE IF EXISTS `maritalStatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `maritalStatus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `officialDocument`
--

DROP TABLE IF EXISTS `officialDocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `officialDocument` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `institutionName` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `organization`
--

DROP TABLE IF EXISTS `organization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization` (
  `idCommerce` int(11) unsigned NOT NULL,
  `idUser` int(11) unsigned NOT NULL,
  `idRoleMpos` int(11) unsigned NOT NULL,
  `idRoleEcommerce` int(11) unsigned NOT NULL,
  `idRoleTransfer` int(11) unsigned NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`idCommerce`,`idUser`),
  KEY `roleMpos` (`idRoleMpos`),
  KEY `roleEcommerce` (`idRoleEcommerce`),
  KEY `roleTransfer` (`idRoleTransfer`),
  KEY `commerce` (`idCommerce`),
  CONSTRAINT `organization_commerce` FOREIGN KEY (`idCommerce`) REFERENCES `commerces` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `organization_roleEcommerce` FOREIGN KEY (`idRoleEcommerce`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `organization_roleMpos` FOREIGN KEY (`idRoleMpos`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `organization_roleTransfer` FOREIGN KEY (`idRoleTransfer`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clave` varchar(2) NOT NULL COMMENT 'Cve_Ent - Clave de la entidad',
  `name` varchar(40) NOT NULL COMMENT 'Nom_Ent  - Nombre de la entidad',
  `abrev` varchar(10) NOT NULL COMMENT 'Nom_Abr - Nombre abreviado de la entidad',
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COMMENT='Tabla de Estados de la República Mexicana';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'registercommerce'
--

--
-- Dumping routines for database 'registercommerce'
--
/*!50003 DROP PROCEDURE IF EXISTS `createNewCommerce` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `createNewCommerce`(
  IN representativeName VARCHAR(45),
  IN representativeLastName VARCHAR(45),
  IN representativeMotherLastName VARCHAR(45),
  IN birthday VARCHAR(45),
  IN maritalStatus INT UNSIGNED,
  IN representativeAddress VARCHAR(45),
  IN representativeExtNumber VARCHAR(45),
  IN representativeIntNumber VARCHAR(45),
  IN representativeZipCode VARCHAR(45),
  IN representativeSuburb VARCHAR(45),
  IN representativeCity INT UNSIGNED,
  IN representativeState INT UNSIGNED,
  IN representativeCountry INT UNSIGNED,
  IN representativeRFC VARCHAR(45),
  IN CURP VARCHAR(45),
  IN commerceName VARCHAR(45),
  IN socialReason VARCHAR(45),
  IN commerceWebPgae VARCHAR(45),
  IN commerceAddress VARCHAR(45),
  IN commerceExtNumber VARCHAR(45),
  IN commerceIntNumber VARCHAR(45),
  IN commerceZipCode VARCHAR(45),
  IN commerceSuburb VARCHAR(45),
  IN commerceCity INT UNSIGNED,
  IN commerceState INT UNSIGNED,
  IN commerceCountry INT UNSIGNED,
  IN commerceRFC VARCHAR(45),
  IN commerceEmail VARCHAR(45),
  IN commercePhone VARCHAR(45),
  IN commerceMonth1Sale VARCHAR(45),
  IN commerceMonth2Sale VARCHAR(45),
  IN commerceMonth3Sale VARCHAR(45),
  IN totalTransactionCash VARCHAR(45),
  IN totalTransactionEcommerce VARCHAR(45),
  IN totalTransactionPos VARCHAR(45), 
  IN commerceAveragePerMonth VARCHAR(45), 
  IN commerceAveragePerTransaction VARCHAR(45),
  IN commerceType INT UNSIGNED,
  IN lineBusiness INT UNSIGNED,
  IN clabe VARCHAR(45),
  IN idOfificialDocument INT UNSIGNED,
  IN oficialDocumentNumber VARCHAR(45),
  IN validity VARCHAR(45),
  IN notaryCity INT UNSIGNED,
  IN actNumber VARCHAR(45),
  IN registrationDate VARCHAR(45),
  IN notaryNumber VARCHAR(45),
  IN nameOfTheNotary VARCHAR(45),
  IN numeroCatastro VARCHAR(45)
)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;  -- rollback any changes made in the transaction
        RESIGNAL;  -- raise again the sql exception to the caller
    END;
	
    START TRANSACTION;
    
    -- Insert commerce address
        INSERT INTO `addresses` (
            `idCountry`,
            `street`,
            `suburb`,
            `zipCode`,
            `exteriorNumber`,
            `interiorNumber`,
            `idState`,
            `idCity`
		) VALUES (
            commerceCountry,
            commerceAddress,
            commerceSuburb,
            commerceZipCode,
            commerceExtNumber,
            commerceIntNumber,
            commerceState,
            commerceCity
		);
        SET @idCommerceAddress = LAST_INSERT_ID();
        
         -- Insert commerce
        INSERT INTO `commerces` (
            `idCommerceType`,
            `idLineBusiness`
		) VALUES (
            commerceType,
            lineBusiness
		);
        SET @idCommerce = LAST_INSERT_ID();
        
        -- Insert commerce general info
        INSERT INTO `generalInfo` (
			`idCommerce`,
            `idAddress`,
            `commerceName`,
            `email`,
            `phone`,
            `rfc`,
            `socialReason`,
            `webPage`,
            `clabe`,
            `idCity`,
            `actNumber`,
            `registrationDate`,
            `notaryNumber`,
            `nameOfTheNotary`,
            `numeroCatastro`
        ) VALUES (
			@idCommerce,
            @idCommerceAddress,
            commerceName,
            commerceEmail,
            commercePhone,
            commerceRFC,
            socialReason,
            commerceWebPgae,
            clabe,
            notaryCity,
            actNumber,
            registrationDate,
            notaryNumber,
            nameOfTheNotary,
            numeroCatastro
        );
        
         -- Insert representative address
        INSERT INTO `addresses` (
            `idCountry`,
            `street`,
            `suburb`,
            `zipCode`,
            `exteriorNumber`,
            `interiorNumber`,
            `idState`,
            `idCity`
		) VALUES (
            representativeCountry,
            representativeAddress,
            representativeSuburb,
            representativeZipCode,
            representativeExtNumber,
            representativeIntNumber,
            representativeState,
            representativeCity
		);
        SET @idRepresentativeAddress = LAST_INSERT_ID();
        
        INSERT INTO legalRepresentative (
         `idCommerce`,
         `idMaritalStatus`,
         `idAddress`,
         `name`,
         `lastName`,
         `motherLastName`,
         `birthday`,
         `RFC`,
         `CURP`,
		 `idOfificialDocument`,
         `oficialDocumentNumber`,
         `validity`
      ) VALUES (
        @idCommerce,
        maritalStatus,
        @idRepresentativeAddress,
        representativeName,
        representativeLastName,
        representativeMotherLastName,
        birthday,
        representativeRFC,
        CURP,
        idOfificialDocument,
        oficialDocumentNumber,
        validity
      );
      
      INSERT INTO financialInformation (
		`idCommerce`,
        `month1`,
        `month2`,
        `month3`,
        `totalCash`,
        `totalPos`,
        `totalEcommerce`,
        `averagePerMonth`,
        `averagePerTransaction`
      ) VALUES (
		@idCommerce,
        commerceMonth1Sale,
        commerceMonth2Sale,
        commerceMonth3Sale,
        totalTransactionCash,
        totalTransactionPos,
        totalTransactionEcommerce,
        commerceAveragePerMonth,
        commerceAveragePerTransaction
      );
      
      
      SELECT @idCommerce as 'idCommerce';
      COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-13  9:44:17
