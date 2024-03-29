/* eslint-disable prettier/prettier */
import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { DatabaseService } from 'src/database/database.service';
import { verifyEmailDto } from './dtos/verifyEmailDto';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private database: DatabaseService,
    private mailerService: MailerService,
  ) {
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.database.user.findFirst({
        where: { email },
      });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return user;
        }
      }
      return null;
    } catch (err) {
      return err;
    }
  }
  async validateToken(id: number) {
    try {
      const token = await this.database.tokens.findUnique({
        where: {
          id,
        },
      });
      // console.log(token);
      
      return token;
    } catch (err) {
      return err;
    }
  }
  async clientRegister(userDto: CreateUserDto) {
    const userExist = await this.database.user.findFirst({
      where: {
        OR: [{ email: userDto.email }, { phoneNumber: userDto.phoneNumber }],
      },
    });
    if (userExist) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    const saltOrRounds = 10;
    userDto.password = await bcrypt.hash(userDto.password, saltOrRounds);
    const user = await this.database.user.create({
      data: userDto,
    });
    return {
      ...user,
      message: 'user has been created successfully',
    };
  }
  //-------------------------------------------
  async login(user: any): Promise<any> {
    try {
      const token = await this.database.tokens.create({
        data: {
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });
      delete user.password;
      return {
        message: 'loged in successfully',
        ...user,
        access_token: this.jwtService.sign({
          user: { user_id: user.id, token_id: token.id, role: user.role },
        }),
      };
    } catch (err) {
      console.log("incorrect");
      
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.database.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const updatedUser = await this.database.user.update({
        where: { id },
        data: updateUserDto,
      });
      delete updatedUser.password;
      return { ...updatedUser, message: 'user updated successfully' };
    } catch (err) {
      return err;
    }
  }
  async getAccount(req) {
    try {
      const user = await this.database.user.findUnique({
        where: {
          id: req.user.user_id,
        },
        include: {
          sends: true,
          recives: true
        }
      });   
      delete user.password
      delete user.id
      delete user.emailVerification         
      return { user };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async logout(req) {
    try {
      await this.database.tokens.delete({
        where: {
          id: req.user.token_id,
        },
      });
      return { message: 'loged out successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async deleteAccount(request){
    try {
      await this.database.transaction.deleteMany({
        where: {
          sender_id: request.user.token_id
        }
      })
      const deletedAccount = await this.database.user.delete({
        where:{
          id:request.user.tokenId
        }
      })
      return { data: deletedAccount, message: 'account has been deleted' };
    } catch (error) {
      // console.error(error);
      throw error;
    }
  }
  async verifyEmail(verifyEmail: verifyEmailDto) {
    try {
      const user = await this.database.user.findUnique({
        where: { email: verifyEmail.email },
      });
      if (!user) {
        throw new HttpException(
          `no user with this email `,
          HttpStatus.BAD_REQUEST,
        );
      }
      const fourDigits = Math.floor(Math.random() * 9000) + 1000;

      const secret = process.env.ACCESS_SECRET;
      const token = this.jwtService.sign(
        { code: fourDigits },
        {
          secret,
          expiresIn: 60 * 15,
        },
      );
      await this.database.user.update({
        where: { email: verifyEmail.email },
        data: {
          emailVerification: token,
        },
      });
      try {
        await this.mailerService.sendMail({
          to:user.email,
          from: process.env.HOST_EMAIL,
          subject:'verify code',
          text:`Verification Code Is : ${fourDigits}`,
        })
      } catch (err) {
        console.error(err);
      }
      return { message: 'verification code sent successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async verifyResetPassword(
    verifyEmail: verifyEmailDto,
    token: string,
  ) {
    try {
      const user = await this.database.user.findUnique({
        where: { email: verifyEmail.email },
      });
      const secret = process.env.ACCESS_SECRET;
      const payload = await this.jwtService.verify(
        user.emailVerification,
        {
          secret,
        },
      );
      if (payload.code != token) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      return { message: 'valid numbers reset password now' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto, token: string) {
    try {
      const user = await this.database.user.findFirst({
        where: { email: resetPasswordDto.email },
      });
      const secret = process.env.ACCESS_SECRET;
      const payload = await this.jwtService.verify(
        user.emailVerification,
        {
          secret,
        },
      );
      if (payload.code != token) {
        throw new HttpException("user doesn't exist", HttpStatus.BAD_REQUEST);
      }
      const saltOrRounds = 10;
      resetPasswordDto.password = await bcrypt.hash(
        resetPasswordDto.password,
        saltOrRounds,
      );
      const updatedUser = await this.database.user.update({
        where: { email: resetPasswordDto.email },
        data: {
          password: resetPasswordDto.password,
        },
      });
      delete user.password;
      return { ...updatedUser, message: 'reset password successfully' };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
  @Cron(CronExpression.EVERY_5_MINUTES)
  async deleteExpiredTokens() {
    try {
      console.log('Checking for expired tokens...');
      const expiredTokens = await this.database.tokens.findMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
      if (expiredTokens.length > 0) {
        console.log(`Found ${expiredTokens.length} expired tokens`);
        for (const token of expiredTokens) {
          await this.database.tokens.delete({
            where: {
              id: token.id,
            },
          });
        }
        console.log('Deleted expired tokens');
      } else {
        console.log('No expired tokens found');
      }
    } catch (err) {
      return err;
    }
  }
}
