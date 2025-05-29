import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  role?: 'admin' | 'manager' | 'employee' = 'employee';

  @IsNumber()
  @IsNotEmpty()
  departmentId?: number; // Assuming departmentId is a number, adjust type as necessary
}
