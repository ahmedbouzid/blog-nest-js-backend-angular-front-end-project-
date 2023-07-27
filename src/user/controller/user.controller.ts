import { Body, Controller, Delete, Get, Param, Post , Put } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user.interface';
import { Observable, from } from 'rxjs';
import { log } from 'console';

@Controller('users')
export class UserController {

    constructor (private readonly service : UserService){}
    @Post()
    create(@Body()user : User) :Observable<User>{
        return this.service.createUser(user)
    }
    @Get(':id')
    findOne(@Param()params):Observable<User> {

        return this.service.findOneById(params.id)

    }
    @Get()
    findAll():Observable<User[]>{
        console.log(this.service.findAll())
        return this.service.findAll();
    }
    @Delete(':id')
    deleteOne(@Param('id') id : string) : Observable<User>{
        return this.service.deleteOne(Number(id))
    }
    @Put(':id')
    updateOne(@Param('id') id:string ,@Body() user:User) :Observable<any>{
        return this.service.updateOne(Number(id) , user)
    }
}
