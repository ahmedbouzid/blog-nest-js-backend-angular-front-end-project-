import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { BlogserviceService } from '../blogservice/blogservice.service';
import { Observable, from } from 'rxjs';
import { BlogEntry } from '../model/blog-entry.interface';
import { JwtAuthGuard } from 'src/auth/auth/gards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/auth/gards/roles.guard';

@Controller('blogs')
export class BlogController {

    constructor(private blogService : BlogserviceService) {}

    
@UseGuards(JwtAuthGuard , RolesGuard)
@Post()
create(@Body() blogEntry : BlogEntry , @Request() req) : Observable<BlogEntry> {
    const user = req.user ;
    return from(this.blogService.create(user ,blogEntry))
}
@Get()
findBlogByEntries (@Query('userId') userId : number) : Observable<BlogEntry[]> {

      if (userId == null) {
        return this.blogService.findAll();
    } else {
        return this.blogService.findByUser(userId) ;
    }
}
@Get (':id')
findOne(@Param('id') id : number) : Observable<BlogEntry> { 
    return this.blogService.findOne(id)
}
}
