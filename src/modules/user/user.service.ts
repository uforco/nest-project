import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LogInUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { argonPasswordService } from 'src/auth/argonPassword.service';
import { JwtService } from 'src/auth/jwt.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly argonPassword: argonPasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashPassword = await this.argonPassword.hashPassword(
        createUserDto.password,
      );
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashPassword,
          // role: 'USER',
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      };
    } catch (e) {
      if (e.code === 'P2002') {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email already exists',
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: e,
          },
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }
  async signIn(createUserDto: LogInUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
        },
      })
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: 'Invalid credentials',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const isPasswordValid = await this.argonPassword.vefifyPassword(
        createUserDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
        }
      }
      delete user.password;

      const token = this.jwtService.getGenerateToken({...user});

      return {...user, token};

      
    } catch (e) {
      if(e.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            message: e.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }


      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return users;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: e,
        },
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
