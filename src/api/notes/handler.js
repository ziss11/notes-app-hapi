const autobind = require('auto-bind')
const ClientError = require('../../exceptions/ClientError')

class NotesHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autobind(this)
  }

  async postNoteHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)
      const { title = 'untitled', body, tags } = request.payload

      const noteId = await this._service.addNote({ title, tags, body })
      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: { noteId }
      })

      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami'
      })

      response.code(500)
      console.log(error.message)
      return response
    }
  }

  async getNotesHandler (request, h) {
    const notes = await this._service.getNotes()
    const response = h.response({
      status: 'success',
      data: { notes }
    })
    return response
  }

  async getNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      const note = await this._service.getNoteById(id)

      return h.response({
        status: 'success',
        data: { note }
      })
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami'
      })

      response.code(500)
      console.log(error.message)
      return response
    }
  }

  async putNoteByIdHandler (request, h) {
    try {
      this._validator.validateNotePayload(request.payload)
      const { id } = request.params

      await this._service.editNoteById(id, request.payload)

      return h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui'
      })
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami'
      })

      response.code(500)
      console.log(error.message)
      return response
    }
  }

  async deleteNoteByIdHandler (request, h) {
    try {
      const { id } = request.params
      await this._service.deleteNoteById(id)
      return h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus'
      })
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf terjadi kegagalan pada server kami'
      })

      response.code(500)
      console.log(error.message)
      return response
    }
  }
}

module.exports = NotesHandler
