const autoBind = require('auto-bind')
const ClientError = require('../../exceptions/ClientError')

class UploadsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postUploadImageHandler (request, h) {
    try {
      const { data } = request.payload
      this._validator.validateImageHeaders(data.hapi.headers)
      const fileLocation = await this._service.writeFile(data, data.hapi)

      const response = h.response({
        status: 'success',
        data: { fileLocation }
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

module.exports = UploadsHandler
