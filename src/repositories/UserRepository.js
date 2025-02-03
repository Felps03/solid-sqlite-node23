// src/repositories/UserRepository.js
export class UserRepository {
  constructor(db) {
    this.db = db;
  }

  create(user) {
    const stmt = this.db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    stmt.run(user.name, user.email);
    // Get the last inserted ID using SQLite's last_insert_rowid() function.
    const row = this.db.prepare('SELECT last_insert_rowid() AS id').get();
    return { id: row.id, ...user };
  }

  getById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  getAll() {
    return this.db.prepare('SELECT * FROM users').all();
  }

  update(id, user) {
    const stmt = this.db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
    stmt.run(user.name, user.email, id);
    return { id, ...user };
  }

  delete(id) {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
    // Check how many rows were affected.
    const row = this.db.prepare('SELECT changes() AS count').get();
    return row.count > 0;
  }
}
