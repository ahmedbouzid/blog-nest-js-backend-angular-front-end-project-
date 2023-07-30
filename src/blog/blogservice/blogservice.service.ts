import { Injectable } from '@nestjs/common';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { BlogEntry } from '../model/blog-entry.interface';
import { User } from 'src/user/models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { UserService } from 'src/user/service/user.service';
import { BlogEntity } from '../model/blog-entry.entity';
var slugify = require('slugify')
@Injectable()
export class BlogserviceService {

    constructor(
        @InjectRepository(BlogEntity) private readonly blogRepo : Repository<BlogEntity>,
        private userService : UserService
        ){}

    create( user :User , blogEntry : BlogEntry):Observable<BlogEntry> {
        
        blogEntry.author =user ;
        return this.generateSlug(blogEntry.title).pipe(
            switchMap((slug :string)=> {
                blogEntry.slug = slug ;
                return from (this.blogRepo.save(blogEntry))
            })
        )
    }
    generateSlug(title : string) : Observable<string>{
        return of(slugify(title)) ;
    }
    findAll():Observable<BlogEntry[]>{

        return from(this.blogRepo.find( {relations : ['author']}))
    }
    findByUser(userId :number) : Observable<BlogEntry[]>{
        return from(this.blogRepo.find({
            where : {
                author : {id : Equal(userId)}
                    } ,
            relations : ['author']
        })).pipe(
            map((blogEntries :BlogEntry [])=> blogEntries)
        )
    }
    findOne(id: number): Observable<BlogEntry> {
        return from(this.blogRepo.findOne({where :{id}, relations: ['author']}));
    }
}
