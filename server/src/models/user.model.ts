import { query } from '../database/db';
import { User } from '../../../shared/types/user';

export class UserModel {
  static async findById(id: string): Promise<User | null> {
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const res = await query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }

  static async create(name: string, email: string, passwordHash: string): Promise<User> {
    const res = await query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at as "createdAt", updated_at as "updatedAt"`,
      [name, email, passwordHash]
    );
    return res.rows[0];
  }
}
