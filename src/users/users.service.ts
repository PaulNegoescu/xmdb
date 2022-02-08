import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { RegisterDto } from '../auth/dto/register.dto';
import { hashPassword } from './password.utilites';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createDefaultUser(registerDto: RegisterDto): Promise<User> {
    const role = await this.prisma.role.findFirst({
      where: { name: 'user' },
    });

    return this.create({
      ...registerDto,
      roleId: role.id,
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, ...dataWithoutRoleId } = createUserDto;

    const data = {
      ...dataWithoutRoleId,
      role: { connect: { id: roleId } },
    };

    data.password = await hashPassword(data.password);

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

  findAll(params?: {
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

  findOne(where: { id?: string; email?: string }) {
    return this.prisma.user.findUnique({ where });
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
