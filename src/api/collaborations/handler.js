const autoBind = require('auto-bind')
const ClientError = require('../../exceptions/ClientError')

class CollaborationsHandler {
  constructor (collaborationsService, notesService, validator) {
    this._collaborationsService = collaborationsService
    this._notesService = notesService
    this._validator = validator

    autoBind(this)
  }

  async postCollaborationHandler (request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const { noteId, userId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId)

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: { collaborationId }
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

  async deleteCollaborationHandler (request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const { noteId, userId } = request.payload
      const { id: credentialId } = request.auth.credentials

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      await this._collaborationsService.deleteCollaboration(noteId, userId)

      return h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus'
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

module.exports = CollaborationsHandler
