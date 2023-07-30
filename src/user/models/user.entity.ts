import { BlogEntity } from 'src/blog/model/blog-entry.entity';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole {
    ADMIN = 'admin' ,
    EDITOR = 'editor' ,
    CHIEFEDITOR = 'cheifeditor' ,
    USER = 'user'
}
@Entity()
export class UserEntity {
@PrimaryGeneratedColumn()
id : number ;
@Column()
name : string ;
@Column({unique:true})
username :string
@Column()
email : string ;
@Column()
password : string ;
@Column({type : 'enum', enum:UserRole, default:UserRole.USER} )
role : UserRole ;
@Column({nullable:true , length:200})
profileImage : string ;
@BeforeInsert()
emailToLowerCase() {
    this.email = this.email.toLowerCase() ;
}
@OneToMany(type => BlogEntity , blogEntity => blogEntity.author)
blogEntries : BlogEntity[] ;

}