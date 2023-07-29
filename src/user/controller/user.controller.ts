import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { Observable, catchError, from, map, of } from 'rxjs';
import { hasRole } from 'src/auth/auth/rolesDecorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/auth/gards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/auth/gards/roles.guard';
import { UserRole } from '../models/user.entity';

@Controller('users')
export class UserController {
    
    constructor(private readonly service: UserService) {}
    @hasRole(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard , RolesGuard)
    @Get()
    findAll(): Observable<User[]> {
        console.log(this.service.findAll());
        return this.service.findAll();
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


    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.service.deleteOne(Number(id));
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.service.updateOne(Number(id), user);
    }

    @Put(':id/role')
    updateRoleOfUser(@Param('id') id ,@Body() user : User) : Observable<User> {
        return this.service.updateRoleOfUser(Number(id) , user)
    }

}
