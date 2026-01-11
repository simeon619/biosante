import { defineConfig } from '@adonisjs/transmit'

export default defineConfig({
  pingInterval: 30000,
  transport: null,
  cors: {
    origin: ['https://biosante.sublymus.com', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})