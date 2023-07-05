import { Exclude } from "class-transformer";
import { Task } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'Users'
})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    username: string

    @Column()
    @Exclude()
    password: string

    @OneToMany(_type => Task, task => task.user, { eager: true })
    @Exclude()
    tasks: Task[]
}