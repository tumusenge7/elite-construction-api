require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/elite_construction',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@eliteconstruction.com',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    apiKey: process.env.AI_API_KEY,
    model: process.env.AI_MODEL || 'gpt-3.5-turbo',
  },
  maps: {
    apiKey: process.env.MAPS_API_KEY,
    provider: process.env.MAPS_PROVIDER || 'leaflet',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
    dir: process.env.UPLOAD_DIR || 'uploads',
  },
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY,
    channelId: process.env.YOUTUBE_CHANNEL_ID,
  },
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};
