const dbSettings = {
    db: process.env.DB_NAME,
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

const serverSettings = {
    port: process.env.SERVER_PORT || 3000,
}

  
const uploadServiceSettings = {
    path: process.env.STORAGE_PATH
}

const productServiceSettings = {
    host: process.env.PRODUCT_SERVER_HOST,
    port: process.env.PRODUCT_SERVER_PORT
}

const authSettings = {
    JWTSecret: process.env.JWT_SECRET
}
const host = 'http://farm:' + serverSettings.port

const kafkaSettings = {
  server: 'kafka:9092',
};

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      components: {},
      info: {
        title: 'Farm service API',
        version: '1.0.0',
        description: 'Microservice FARM api documentation',
      },
    },
    host: host,
    basePath: '/farm',
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['src/**/*.js'],
  };

const awsSettings = {
  s3BucketName:  process.env.AWS_S3_BUCKET_NAME,
}


module.exports = Object.assign({}, { dbSettings, serverSettings, uploadServiceSettings, productServiceSettings,authSettings,kafkaSettings,swaggerOptions,awsSettings})
