module.exports = (handler) => [
  {
    method: 'POST',
    path: '/exports/notes',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'notesapp_jwt'
    }
  }
]
