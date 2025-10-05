import { Gateway } from "encore.dev/api";

const allowedOrigins = [
  'http://localhost:5002',
  'https://frontend-a0s11lix5-finesse-jones-projects-287f926d.vercel.app'
];

export const gateway = new Gateway({
  cors: {
    allowedOrigins,
    allowCredentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
});
