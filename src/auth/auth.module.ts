import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { RolesGuard } from './auth/gards/roles.guard';
import { JwtAuthGuard } from './auth/gards/jwt-auth.guard';
import { JwtStrategy } from './auth/gards/jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        forwardRef(()=> UserModule),
        ConfigModule,
        JwtModule.registerAsync({
            imports:[ConfigModule], 
            inject:[ConfigService],
            useFactory: async (configureService : ConfigService)=> ({
                secret:configureService.get('JWT_SECRET'),
                signOptions:{expiresIn :'10000s'}
            })
        })
    ],
    providers: [AuthService , RolesGuard , JwtAuthGuard , JwtStrategy],
    exports:[AuthService]
})
export class AuthModule {}  
