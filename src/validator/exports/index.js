const InvariantError = require('../../exceptions/InvariantError')
const { ExportPayloadSchema } = require('./schema')

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = ExportsValidator
