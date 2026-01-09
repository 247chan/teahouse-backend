import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Feed API: http://localhost:${PORT}/api/feed`);
});

process.on('SIGINT', () => {
  console.log('\n Shutting down ...');
  process.exit(0);
});