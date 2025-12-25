import { Controller, Get, Post, Put, Body, Param, HttpCode, HttpStatus, Headers, Ip } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.userService.login({
      ...loginUserDto,
      ipAddress,
      userAgent,
    });
  }

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.userService.getProfile(parseInt(id, 10));
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateData: { fullName?: string; address?: any },
  ) {
    return this.userService.updateProfile(parseInt(id, 10), updateData);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
