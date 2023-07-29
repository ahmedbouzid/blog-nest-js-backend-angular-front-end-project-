import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from '../models/user.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../models/user.interface';
import { Observable, catchError, from, map, of, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth/auth.service';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';
import { openSync } from 'fs';
@Injectable()
export class UserService {

    constructor(
        
        @InjectRepository(UserEntity) private readonly userRepository :Repository<UserEntity> ,
        private readonly authService:AuthService
        ) {}

        createUser(user :User) : Observable<User> {      
                return this.authService.hashPassword(user.password).pipe(
                    switchMap((passHash:string) => {
                        const newUser = new UserEntity() ;
                        newUser.name = user.name ;
                        newUser.username = user.username ;
                        newUser.email = user.email;
                        newUser.password = passHash ;
                        newUser.role = UserRole.USER ;
                        
                        return from(this.userRepository.save(newUser)).pipe(
                            map((user:User)=> {
                                const {password , ...result}= user ;
                                return result
                            }) ,
                            catchError(err => throwError(err))
                        )

                    })
                    )
                }
            

        findAll() : Observable<User[] >{
            return from(this.userRepository.find()).pipe(
                map((users : User[])=>{
                    users.forEach(function(v) {delete v.password}) ;
                    return users ;
                })
            )
        }
        deleteOne(id:number) : Observable<any> {
            return from(this.userRepository.delete(id))
        }

        updateOne(id :number , user :User) : Observable<any> {
            delete user.email ;
            delete user.password ;
            delete user.role ;
            return from(this.userRepository.update(id , user))
        }
        updateRoleOfUser(id : number , user:User):Observable<any> {
            return from(this.userRepository.update(id , user))
        }
        findOneById(id: number): Observable<User> {
        //return from(this.userRepository.findOne({ where: { id } }));
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            map((user :User) => {
                const {password ,...result} = user ;
                return result ;
            })
        )
        }

        login(user: User): Observable<Object> {
            return this.validateUser(user.email, user.password).pipe(
                switchMap((user: User) => {
                    if (user) {
                        return from(this.authService.generateJwt(user)).pipe(
                            map((jwt: string) => ({ access_token: jwt }))
                        );
                    } else {
                        return of({ message: 'Wrong Credentials' });
                    }
                })
            );
        }
        validateUser(email : string ,password :string) : Observable<User> {
            return this.findByEmail(email).pipe(
                switchMap((user: User) => 
                    this.authService.comparePasswords(password , user.password).pipe(
                        map((match:boolean)=> {
                            if (match) {
                                const {password , ... result} = user ;
                                return result ;
                            } else {
                                throw Error; 
                            }
                        })
                    )
                )
            )
        }
        findByEmail(email:string) : Observable<User> {
            return from(this.userRepository.findOne({where : {email}}))
        }
         paginate(options: IPaginationOptions): Observable<Pagination<User>> {
            return from(paginate<User>(this.userRepository, options)).pipe(
                map((userPageable:Pagination<User>)=> {
                    userPageable.items.forEach((v) =>{delete v.password}) ;
                    return userPageable ;
                })
            )

            
          }
        paginateFilterByUsernae(options : IPaginationOptions,user : User) : Observable<Pagination<User>> {
            return from (this.userRepository.findAndCount(
                {
                    skip: 0 ,
                    take : Number(options.limit) || 10,
                    order : {id : 'ASC'} ,
                    select : ['id' , 'name','username' ,'email' ,'role'],
                    where : [ 
                        {username : Like(`%${user.username}%`)}
                    ]
                })).pipe(
                    map(([users , totalUsers])=> {
                        const userPAgeable : Pagination<User> ={
                            items : users, 
                            links : {
                                first : options.route + `?limit=${options.limit}`,
                                previous : options.route + `` ,
                                next : options.route + `?limit=${options.limit}&page=${Number(options.page) +1}`,
                                last :options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.page))}`
                            },
                            meta :{
                                currentPage :Number(options.page) ,
                                itemCount : users.length ,
                                itemsPerPage : Number(options.limit)  ,
                                totalItems : totalUsers ,
                                totalPages :Math.ceil(totalUsers / Number(options.limit))
                            }
                        } ;


                        return userPAgeable
                    })
                )
        }
}
