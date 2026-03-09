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
  IN commerceName VARCHAR(200),
  IN socialReason VARCHAR(200),
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
  IN idOfificialDocument INT UNSIGNED,
  IN oficialDocumentNumber VARCHAR(45),
  IN validity VARCHAR(45),
  IN notaryCity INT UNSIGNED,
  IN actNumber VARCHAR(45),
  IN registrationDate VARCHAR(45),
  IN notaryNumber VARCHAR(45),
  IN nameOfTheNotary VARCHAR(45),
  IN numeroCatastro VARCHAR(45),
  IN gender INT,
  IN electronicSignatureSerialNumber VARCHAR(45),
  IN latitude INT,
  IN longitude INT)
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
            `notaryCity`,
            `actNumber`,
            `registrationDate`,
            `notaryNumber`,
            `nameOfTheNotary`,
            `numeroCatastro`,
            `electronicSignatureSerialNumber`,
            `latitude`,
            `longitude`
        ) VALUES (
			@idCommerce,
            @idCommerceAddress,
            commerceName,
            commerceEmail,
            commercePhone,
            commerceRFC,
            socialReason,
            commerceWebPgae,
            notaryCity,
            actNumber,
            registrationDate,
            notaryNumber,
            nameOfTheNotary,
            numeroCatastro,
            electronicSignatureSerialNumber,
            latitude,
            longitude
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
         `validity`,
         `gender`
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
        validity,
        gender
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
END