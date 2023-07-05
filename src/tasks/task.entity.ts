import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task-status-enum.model";
import { User } from "src/auth/user.entity";
import { Exclude } from "class-transformer";

@Entity({
    name: "Tasks"
})
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne(_type => User, user => user.tasks, { eager: false })
    @Exclude()
    user: User;
}