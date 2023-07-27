const { nanoid } = require('nanoid')

class NotesService {
  constructor () {
    this._notes = []
  }

  addNote ({ title, body, tags }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNote = { id, title, tags, body, createdAt, updatedAt }
    this._notes.push(newNote)

    const isSuccess = this._notes.filter((note) => note.id === id).length > 0

    if (!isSuccess) {
      throw new Error('Catatan gagal ditambahkan')
    }

    return id
  }

  getNotes () {
    return this._notes
  }

  getNoteById (id) {
    const note = this._notes.filter((n) => n.id === id)[0]

    if (!note) {
      throw new Error('Catatan tidak ditemukan')
    }

    return note
  }

  editNoteById (id, { title, body, tags }) {
    const updatedAt = new Date().toISOString()
    const noteIndex = this._notes.findIndex((note) => note.id === id)

    if (noteIndex === -1) {
      throw new Error('Gagal memperbarui catatan. Id tidak ditemukan')
    }

    this._notes[noteIndex] = { ...this._notes[noteIndex], title, tags, body, updatedAt }
  }

  deleteNoteById (id) {
    const noteIndex = this._notes.findIndex((note) => note.id === id)

    if (noteIndex === -1) {
      throw new Error('Catatan gagal dihapus. Id tidak ditemukan')
    }

    this._notes.splice(noteIndex, 1)
  }
}

module.exports = NotesService
