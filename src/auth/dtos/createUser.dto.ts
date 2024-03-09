/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEnum,
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
export enum Role {
  ADMIN,
  USER
}
export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(20)
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNumber()
  @IsOptional()
  balance: number;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Validate(PasswordValidation, [passwordRequirement])
  password: string;
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  @IsEnum(Role)
  role: any;
}
