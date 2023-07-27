import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { Observable, catchError, from, map, of } from 'rxjs';

@Controller('users')
export class UserController {

    constructor(private readonly service: UserService) {}

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

    @Get()
    findAll(): Observable<User[]> {
        console.log(this.service.findAll());
        return this.service.findAll();
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.service.deleteOne(Number(id));
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.service.updateOne(Number(id), user);
    }
}