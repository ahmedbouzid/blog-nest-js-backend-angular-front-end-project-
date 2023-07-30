import { Module } from '@nestjs/common';
import { BlogEntity } from './model/blog-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        TypeOrmModule.forFeature([BlogEntity]) ,
        AuthModule ,
        UserModule

    ] ,
})
export class BlogModule {}
