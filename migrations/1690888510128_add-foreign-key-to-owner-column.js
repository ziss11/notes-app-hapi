exports.up = pgm => {
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')")
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner IS NULL")
  pgm.addConstraint('notes', 'fk_notes_owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('notes', 'fk_notes_owner_users.id')
  pgm.sql("UPDATE notes SET owner = NUll WHERE owner = 'old_notes'")
  pgm.sql("DELETE FROM users WHERE owner = 'old_notes'")
}
