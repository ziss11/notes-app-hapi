const autoBind = require('auto-bind')
const ClientError = require('../../exceptions/ClientError')

class ExportsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postExportNotesHandler (request, h) {
    try {
      this._validator.validateExportPayload(request.payload)

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail
      }

      await this._service.sendMessage('export:notes', JSON.stringify(message))

      const response = h.response({
        status: 'success',
        message: 'Permintaan anda dalam antrean'
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
}

module.exports = ExportsHandler
