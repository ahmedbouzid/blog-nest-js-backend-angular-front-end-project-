import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class UserIsUser implements CanActivate {

    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const params = request.params ; 
        const user :User =  request.user
        console.log(params);
        
       return this.userService.findOneById(user.id).pipe(
        map((user : User) => {
            let hasPersmission = false ; 
            if (user.id === Number(params.id) ) {
                hasPersmission = true ;
            }
            return user && hasPersmission
        } )
       )
    }
}