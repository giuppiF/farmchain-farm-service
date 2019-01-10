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

module.exports = Object.assign({}, { dbSettings, serverSettings, uploadServiceSettings })
