import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors , Request, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { Observable, catchError, from, map, of, tap } from 'rxjs';
import { hasRole } from 'src/auth/auth/rolesDecorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth/gards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/auth/gards/roles.guard';
import { UserRole } from '../models/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import {v4 as uuidv4} from 'uuid'
import { AuthGuard } from '@nestjs/passport';
import { join } from 'path';
import { UserIsUser } from 'src/auth/auth/gards/UserIsUser.guard';
const path = require ('path') ;
 export const  storage = {
    storage :diskStorage({
        destination :'./uploads/profileImages' ,
        filename: (req , file , cb )=> {
            const filename :string = path.parse(file.originalname).name.replace(/\s/g,'')+uuidv4() ;
            const extension : string = path.parse(file.originalname).ext ;
            cb(null, `${filename}${extension}`)
                 }
    })
}

@Controller('users')
export class UserController {
    
    constructor(private readonly service: UserService) {}
 
    @Get()
    index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('username') username: string
): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    console.log(username);
    
    if (username === null || username === undefined) {
        return this.service.paginate({page , limit , route :'http://localhost:3000/users' , });

    } else {
        return this.service.paginateFilterByUsernae(
            { page , limit , route :'http://localhost:3000/users'}, 
            {username}
            );

    }
    
    }
    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.service.createUser(user).pipe(
            map((user: User) => user),
            catchError(err => of({ error: err.message }))
        );
    }

    @Get(':id')
    findOne(@Param() params): Observable<User> {
        return this.service.findOneById(params.id);
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.service.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt }; 
            })
        );
    }
    
    @hasRole(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard , RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.service.deleteOne(Number(id));
    }
    @UseGuards(JwtAuthGuard ,UserIsUser)
    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.service.updateOne(Number(id), user);
    }
    @hasRole(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard , RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id ,@Body() user : User) : Observable<User> {
        return this.service.updateRoleOfUser(Number(id) , user)
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file' ,storage))
    uploadFile(@UploadedFile() file , @Request() req) : Observable<Object> {
        console.log(file);
        const user :User = req.user ;
        console.log(user);
        return this.service.updateOne(user.id , {profileImage : file.filename}).pipe(
            
            map((user :User)=> ({profileImage : user.profileImage}))
        )
        
    }
    
    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename , @Res() res) :Observable<Object> {
        return of(res.sendFile(join(process.cwd(),'uploads/profileImages/' +imagename)))
    }
 

}
