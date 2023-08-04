require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')

const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')
const TokenManager = require('./tokenize/TokenManager')

const notes = require('./api/notes')
const NotesService = require('./services/postgres/NotesService')
const CacheService = require('./services/redis/CacheService')
const NotesValidator = require('./validator/notes')

const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

const uploads = require('./api/uploads')
const StorageService = require('./services/S3/StorageService')
const UploadsValidator = require('./validator/uploads')

const init = async () => {
  const cacheService = new CacheService()
  const collaborationsService = new CollaborationsService(cacheService)
  const notesService = new NotesService(collaborationsService, cacheService)
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const storageService = new StorageService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert
    }
  ])

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: users,
      options: { service: usersService, validator: UsersValidator }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: notes,
      options: { service: notesService, validator: NotesValidator }
    },
    {
      plugin: collaborations,
      options: { collaborationsService, notesService, validator: CollaborationsValidator }
    },
    {
      plugin: _exports,
      options: { service: ProducerService, validator: ExportsValidator }
    },
    {
      plugin: uploads,
      options: { service: storageService, validator: UploadsValidator }
    }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
