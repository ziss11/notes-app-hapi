const autoBind = require('auto-bind')
const ClientError = require('../../exceptions/ClientError')

class AuthenticationsHandler {
  constructor (authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._tokenManager = tokenManager
    this._validator = validator

    autoBind(this)
  }

  async postAuthenticationHandler (request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload)
      const id = await this._usersService.verifyUserCredential(request.payload)

      const accessToken = this._tokenManager.generateAccessToken({ id })
      const refreshToken = this._tokenManager.generateRefreshToken({ id })

      await this._authenticationsService.addRefreshToken(refreshToken)

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken
        }
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

  async putAuthenticationHandler (request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload)
      const { refreshToken } = request.payload

      await this._authenticationsService.verifyRefreshToken(refreshToken)
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

      const accessToken = this._tokenManager.generateAccessToken({ id })
      return h.response({
        status: 'success',
        message: 'Access token berhasil diperbarui',
        data: { accessToken }
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

  async deleteAuthenticationHandler (request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload)
      const { refreshToken } = request.payload

      await this._authenticationsService.verifyRefreshToken(refreshToken)
      await this._authenticationsService.deleteRefreshToken(refreshToken)

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus'
      }
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

module.exports = AuthenticationsHandler
