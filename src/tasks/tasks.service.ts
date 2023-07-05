import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        // RAW QUERY - need to be updated
        // let query = `SELECT * FROM "Tasks" `
        // if (status) {
        //     query += `WHERE "Tasks"."status" = '${status}' `
        // }
        // if (search) {
        //     query += `AND LOWER("Tasks"."title") LIKE LOWER('%${search}%') OR LOWER("Tasks"."description") LIKE LOWER('%${search}%')`
        // }
        // const tasksQuery = await this.tasksRepository.query(query)
        // return tasksQuery;

        // QUERY BUILDER
        const query = this.tasksRepository.createQueryBuilder('Tasks');
        query.where({ user })
        if (status) {
            query.andWhere('Tasks.status = :status', { status })
        }
        if (search) {
            query.andWhere(
                '(LOWER(Tasks.title) LIKE LOWER(:search) OR LOWER(Tasks.description) LIKE LOWER(:search))', // Add parentheses () to fix the bug search by user
                { search: `%${search}%` }
            )
        }
        const tasks = await query.getMany()
        return tasks;
    }


    async getTaskById(id: number, user: User): Promise<Task> {
        const options: FindOneOptions = {
            where: {
                id: id,
                user
            }
        }
        const foundTask = await this.tasksRepository.findOne(options);

        // RAW QUERY
        // const foundTask = await this.tasksRepository.query(
        //     `SELECT * FROM Tasks WHERE id = ${id}`
        // )

        if (!foundTask) {
            throw new NotFoundException(`Task with id: ${id} not found`)
        }
        return foundTask;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const data = {
            title,
            description,
            status: TaskStatus.OPEN,
            user
        } as Task
        const task = await this.tasksRepository.save(data)
        return task;

        // RAW QUERY - need to be updated
        // const createdTask = await this.tasksRepository.query(
        //     `
        //     INSERT INTO "Tasks" (title, description, status)
        //     VALUES('${title}', '${description}', '${TaskStatus.OPEN}')
        //     RETURNING *
        //     `
        // )
        // return createdTask;
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status
        await this.tasksRepository.save(task);
        return task;

        // RAW QUERY - need to be updated
        // const task = await this.tasksRepository.query(
        //     `
        //     UPDATE Tasks
        //     SET status = '${status}'
        //     WHERE id = ${id}
        //     RETURNING *
        //     `
        // )
    }

    async deleteTask(id: number, user: User): Promise<string> {
        const deleteTask = await this.tasksRepository.delete({ id, user });
        if (deleteTask.affected === 0) {
            throw new NotFoundException(`Failed to remove the task with id: ${id} - Not Found`)
        }
        return `Task with id: ${id} has been deleted`

        // RAW QUERY - need to be updated
        // const deleteTask = await this.tasksRepository.query(
        //     `
        //     DELETE FROM Tasks
        //     WHERE id = ${id}
        //     RETURNING (*
        //     `
        // )
    }
}

// ========================= TRASH BIN =============================

// getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
//     const { status, search } = filterDto;
//     let tasks = this.getAllTasks();
//     if (status) {
//         tasks = tasks.filter((item) => item.status === status);
//     }
//     if (search) {
//         tasks = tasks.filter((item) => {
//             const title = item.title.toLowerCase()
//             const description = item.description.toLowerCase()
//             const searchWord = search.toLowerCase()
//             if (title.includes(searchWord) || description.includes(searchWord)) {
//                 return true;
//             }
//             return false;
//         })
//     }
//     return tasks;
// }