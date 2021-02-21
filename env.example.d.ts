declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URL: string; //(connection string)
    PORT: string; //(like 8080)
    JWT_SECRET: string; //(jwt secret)
    JWT_EXPIRATION: string; //(jwt expiration in seconds of access token)
    JWT_REFRESH_EXPIRATION: string; //(jwt expiration in seconds of refresh token)
    FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_STORAGE_BUCKET: string;
  }
}
