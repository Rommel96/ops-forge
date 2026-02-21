import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Kysely } from 'kysely';
import { KYSELY } from '../../database/database.module';

@Injectable()
export class AuthService {
  constructor(
    @Inject(KYSELY) private readonly db: Kysely<any>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    // Query user + secret in one join
    const result = await this.db
      .selectFrom('app_public.users as u')
      .innerJoin('app_private.user_secrets as s', 's.user_id', 'u.id')
      .select([
        'u.id',
        'u.username',
        'u.email',
        'u.created_at',
        'u.updated_at',
        's.password_hash',
      ])
      .where('u.username', '=', username)
      .executeTakeFirst();

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      result.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password_hash, ...user } = result;
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
