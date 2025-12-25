import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Embedded Address class for structured address storage
export class Address {
  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  stateProvince: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  country: string;
}

// Login history entry interface
export interface LoginHistoryEntry {
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // Address fields (embedded as JSON for flexibility)
  @Column('simple-json', { nullable: true })
  address: {
    street: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  // Store login history as JSON array
  @Column('simple-json', { nullable: true })
  loginHistory: LoginHistoryEntry[];
}
