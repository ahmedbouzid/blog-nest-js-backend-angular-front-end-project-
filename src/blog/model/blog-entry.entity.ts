import { type } from "os";
import { UserEntity } from "src/user/models/user.entity";
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class BlogEntity {
    @PrimaryGeneratedColumn()
    id:number ;
    @Column() 
    title : string ;
    @Column() 
    slug : string ;
    
    @Column()
    description:string
    @Column({default:''})
    body:string

    @Column({type :'timestamp' , default : ()=> 'current_TimeStamp'})
    createdAt : Date ; 
    @Column({type :'timestamp' , default : ()=> 'current_TimeStamp'})
    updatedAt : Date ; 

    @BeforeUpdate()
    updateTimeStamps() {
    this.updatedAt = new Date ;
    }
    
    @Column( {default : 0}) 
    likes : number ;

    @Column() 
    headerImage : string ;

    @Column()
    publishedDate : Date 

    @Column ()
    isPublish : boolean ;

    @ManyToOne(type => UserEntity , user => user.blogEntries)
    author : UserEntity ;
}