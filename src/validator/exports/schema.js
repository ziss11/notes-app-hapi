const Joi = require('joi')

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required()
})

module.exports = { ExportPayloadSchema }
