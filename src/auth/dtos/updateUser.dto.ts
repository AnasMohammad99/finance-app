/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from 'class-validator-password-check';
const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};
export class UpdateUserDto {
  @MinLength(3)
  @IsOptional()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsOptional()
  phoneNumber: string;
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string;
  @IsNumber()
  @IsOptional()
  balance: number;
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;
}
