import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { log } from "console";
import { Observable, map } from "rxjs";
import { User } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector ,
    @Inject(forwardRef(()=> UserService)) 
    private userService : UserService
    ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> |Observable <boolean>   
{
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
}
const request = context.switchToHttp().getRequest();

const user:User = request.user;

return this.userService.findOneById(user.id).pipe(
    map((user: User) => {
      return roles.includes(user.role); // Check if the user's role is in the allowed roles
    })
  );

console.log(user);

return true;
  }
}
