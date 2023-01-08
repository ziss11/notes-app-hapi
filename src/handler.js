const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const {title, tags, body} = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {id, title, tags, body, createdAt, updatedAt};

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'Success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'Fail',
    message: 'Catatan gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: 'Success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const {id} = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return h.response({
      status: 'Success',
      data: {
        note,
      },
    });
  }

  const response = h.response({
    status: 'Fail',
    message: 'Catatan tidak ditemukan',
  });

  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const {id} = request.params;
  const {title, tags, body} = request.payload;

  const updatedAt = new Date().toISOString();

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notes[noteIndex] = {...notes[noteIndex], title, tags, body, updatedAt};

    const response = h.response({
      status: 'Success',
      message: 'Catatan berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'Fail',
    message: 'Catatan gagal diperbarui, Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const {id} = request.params;

  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);

    const response = h.response({
      status: 'Success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'Fail',
    message: 'Catatan gagal dihapus, Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
