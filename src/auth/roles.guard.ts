import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable()
export class RolesGuard extends JwtService implements CanActivate {
  // private readonly roles: string[] = ['admin', 'user'];
  constructor(private readonly roles: string[]) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return false;
    }
    const jwtdd = this.getVerifyToken(token);
    if (!jwtdd) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'unauthorized access',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    // Check if the user has the required role
    if (!this.roles.includes(jwtdd.role)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          message: 'unauthorized access',
          error: 'Forbidden',
        },
        HttpStatus.FORBIDDEN,
      );
    } // Check if the user has the required role
    return true;
  }
}
