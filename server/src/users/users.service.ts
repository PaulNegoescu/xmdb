import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // generate random 16 bytes long salt
      const salt = randomBytes(16).toString('hex');

      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  validatePassword(password, hash): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(':');
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
      });
    });
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    let { roleId, ...dataWithoutRoleId } = createUserDto;
    if (!roleId) {
      const role = await this.prisma.role.findFirst({
        where: { name: 'user' },
      });
      roleId = role.id;
    }
    const data = {
      ...dataWithoutRoleId,
      role: { connect: { id: roleId } },
    };

    data.password = await this.hashPassword(data.password);

    try {
      const result = await this.prisma.user.create({
        data,
      });
      return result;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'An account with this email address already exists!',
          );
        }
      }
      throw e;
    }
  }

  findAll() {
    return this.users({});
  }

  findOne(id: string) {
    return this.user({ id });
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const where = { id };
    const { roleId, ...dataWithoutRoleId } = updateUserDto;
    const data = {
      ...dataWithoutRoleId,
      role: { connect: { id: roleId } },
    };
    return this.prisma.user.update({
      data,
      where,
    });
  }

  remove(id: string): Promise<User> {
    const where = { id };
    return this.prisma.user.delete({
      where,
    });
  }
}
