const UploadsHandler = require('./handlers')
const routes = require('./routes')

module.exports = {
  name: 'uploads',
  version: '1.0.1',
  register: async (server, { service, validator }) => {
    const uploadsHandler = new UploadsHandler(service, validator)
    server.route(routes(uploadsHandler))
  }
}
