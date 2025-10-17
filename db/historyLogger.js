import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.resolve("pipeline_history.db"));

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    command TEXT NOT NULL,
    created_on TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'started',  -- started | completed | failed
    error_reason TEXT DEFAULT '',
    keywords_raw TEXT,
    keywords_count INTEGER DEFAULT 0
  )
`).run();

export function logHistory({
  id = null,
  command,
  status,
  error_reason,
  keywords_raw,
  keywords_count
}) {
  if (id) {
    const updates = [];
    const values = [];

    if (command !== undefined) {
      updates.push("command = ?");
      values.push(command);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (error_reason !== undefined) {
      updates.push("error_reason = ?");
      values.push(error_reason);
    }
    if (keywords_raw !== undefined) {
      updates.push("keywords_raw = ?");
      values.push(keywords_raw);
    }
    if (keywords_count !== undefined) {
      updates.push("keywords_count = ?");
      values.push(keywords_count);
    }

    if (updates.length === 0) {
      return { id, updated: false, reason: "No fields to update" };
    }

    const sql = `UPDATE history SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);
    db.prepare(sql).run(...values);

    return { id, updated: true };
  } else {
    // --- INSERT new record ---
    const stmt = db.prepare(`
      INSERT INTO history (command, status, error_reason, keywords_raw, keywords_count)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      command || "",
      status || "started",
      error_reason || "",
      keywords_raw || "",
      keywords_count || 0
    );

    return { id: result.lastInsertRowid, created: true };
  }
}

export function getHistory(page = 1) {
  const limit = 5;
  const offset = (page - 1) * limit;
  const stmt = db.prepare(`
    SELECT * FROM history
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset);
}

export function getHistoryById(id) {
  const stmt = db.prepare("SELECT * FROM history WHERE id = ?");
  const row = stmt.get(id);
  return row || null;
}