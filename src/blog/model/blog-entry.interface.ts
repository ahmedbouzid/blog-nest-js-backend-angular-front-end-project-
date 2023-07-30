import { User } from "src/user/models/user.interface";

export interface BlogEntry {

    id ?: number ;
    title?: string ;
    slug ?:string ;
    description ?:string ;
    body ?:string ;
    createdAt ?:Date ;
    updatedAt ?:Date ;
    lzikes ?: number ;
    author ? : User ;
    headerImage ?: string ;
    publishedDate ?: Date ;
    isPublish ?: boolean ;

}