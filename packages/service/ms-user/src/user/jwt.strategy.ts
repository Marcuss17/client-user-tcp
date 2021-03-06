import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User) private userRepository: Repository<User> 
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET,
        });
    }

    async validate(payload: JwtPayload){
        const { email } = payload;
        const user = await this.userRepository.findOne({email});

        if(!user){
            throw new UnauthorizedException();
        }

        return user;
    }
}