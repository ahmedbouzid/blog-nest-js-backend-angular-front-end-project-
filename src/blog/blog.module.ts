import { Module } from '@nestjs/common';
import { BlogEntity } from './model/blog-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogController } from './controller/blog.controller';
import { BlogserviceService } from './blogservice/blogservice.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), AuthModule, UserModule],
  controllers: [BlogController  ],
  providers: [BlogserviceService], 
})
export class BlogModule {}
