import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, LoginHistoryEntry } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

// Interface for login request with optional IP/device info
interface LoginRequest extends LoginUserDto {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<{ message: string; user: Partial<User> }> {
    const { fullName, email, password, address } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = this.userRepo.create({
      fullName,
      email,
      password: hashedPassword,
      address: address || null,
      loginHistory: [],
    });

    const savedUser = await this.userRepo.save(user);

    // Return user without password
    return {
      message: 'User registered successfully',
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        address: savedUser.address,
        createdAt: savedUser.createdAt,
      },
    };
  }

  async login(loginRequest: LoginRequest): Promise<{ message: string; user: Partial<User> }> {
    const { email, password, ipAddress, userAgent } = loginRequest;

    // Find user by email
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update lastLoginAt timestamp
    const now = new Date();
    user.lastLoginAt = now;

    // Add entry to login history (keep last 10 entries)
    const loginEntry: LoginHistoryEntry = {
      timestamp: now,
      ipAddress: ipAddress || 'Unknown',
      userAgent: userAgent || 'Unknown',
      device: this.parseDevice(userAgent),
    };

    if (!user.loginHistory) {
      user.loginHistory = [];
    }
    user.loginHistory = [loginEntry, ...user.loginHistory].slice(0, 10);

    await this.userRepo.save(user);

    // Return user without password
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        loginHistory: user.loginHistory,
      },
    };
  }

  // Get user profile by ID
  async getProfile(userId: number): Promise<Partial<User>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      loginHistory: user.loginHistory,
    };
  }

  // Update user profile
  async updateProfile(userId: number, updateData: Partial<User>): Promise<Partial<User>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update allowed fields
    if (updateData.fullName) user.fullName = updateData.fullName;
    if (updateData.address) user.address = updateData.address;

    await this.userRepo.save(user);

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepo.find();
    // Return users without passwords
    return users.map(({ password, ...user }) => user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  // Helper to parse device from user agent
  private parseDevice(userAgent?: string): string {
    if (!userAgent) return 'Unknown Device';

    if (userAgent.includes('Mobile')) return 'Mobile';
    if (userAgent.includes('Tablet')) return 'Tablet';
    if (userAgent.includes('Windows')) return 'Windows PC';
    if (userAgent.includes('Mac')) return 'Mac';
    if (userAgent.includes('Linux')) return 'Linux PC';

    return 'Desktop';
  }
}
