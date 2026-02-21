import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Kysely } from 'kysely';
import { KYSELY } from '../../database/database.module';

@Injectable()
export class TasksService {
  constructor(@Inject(KYSELY) private readonly db: Kysely<any>) {}

  async findAll(status?: string) {
    let query = this.db
      .selectFrom('app_public.tasks as t')
      .innerJoin('app_public.users as u', 'u.id', 't.owner_id')
      .select([
        't.id',
        't.title',
        't.description',
        't.status',
        't.priority',
        't.due_date',
        't.owner_id',
        't.created_at',
        't.updated_at',
        'u.username as owner_username',
        'u.email as owner_email',
      ])
      .orderBy('t.created_at', 'desc');

    if (status) {
      query = query.where('t.status', '=', status);
    }

    const tasks = await query.execute();

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      owner_id: task.owner_id,
      created_at: task.created_at,
      updated_at: task.updated_at,
      owner: {
        username: task.owner_username,
        email: task.owner_email,
      },
    }));
  }

  async findOne(id: string) {
    const task = await this.db
      .selectFrom('app_public.tasks as t')
      .innerJoin('app_public.users as u', 'u.id', 't.owner_id')
      .select([
        't.id',
        't.title',
        't.description',
        't.status',
        't.priority',
        't.due_date',
        't.owner_id',
        't.created_at',
        't.updated_at',
        'u.username as owner_username',
        'u.email as owner_email',
      ])
      .where('t.id', '=', id)
      .executeTakeFirst();

    if (!task) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      owner_id: task.owner_id,
      created_at: task.created_at,
      updated_at: task.updated_at,
      owner: {
        username: task.owner_username,
        email: task.owner_email,
      },
    };
  }

  async create(data: Record<string, any>, ownerId: string) {
    const result = await this.db
      .insertInto('app_public.tasks')
      .values({
        title: data.title,
        description: data.description || null,
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        due_date: data.due_date || null,
        owner_id: ownerId,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    return this.findOne(result.id);
  }

  async update(id: string, data: Record<string, any>) {
    // First check existence
    await this.findOne(id);

    const updateData: Record<string, any> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.due_date !== undefined) updateData.due_date = data.due_date;

    if (Object.keys(updateData).length > 0) {
      await this.db
        .updateTable('app_public.tasks')
        .set(updateData)
        .where('id', '=', id)
        .execute();
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.deleteFrom('app_public.tasks').where('id', '=', id).execute();
  }
}
