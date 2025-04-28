import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey: string = process.env.JWT_SECRET_KEY;

  getGenerateToken(payload: any): string {
    if (!this.secretKey || !payload) {
      throw new HttpException(
        {
          status: 500,
          error: 'Internal Server Error',
        },
        500,
        {
          cause: new Error('JWT secret key or payload is missing'),
        },
      );
    }
    return jwt.sign(payload, this.secretKey, {
      expiresIn: '1h',
    });
  }

  getVerifyToken(token: string): any {
    try {
      if (!this.secretKey || !token) {
        throw new HttpException(
          {
            status: 500,
            error: 'Internal Server Error',
          },
          500,
          {
            cause: new Error('JWT secret key or token is missing'),
          },
        );
      }
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: "unauthorized"
          },
          HttpStatus.UNAUTHORIZED,
          {
            cause: error,
          },
        );
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: "unauthorized"
          },
          HttpStatus.FORBIDDEN,
          {
            cause: error,
          },
        );
      } else {
        throw new HttpException(
          {
            status: 500,
            error: 'Internal Server Error',
          },
          500,
          {
            cause: error,
          },
        );
      }
    }
  }
}
