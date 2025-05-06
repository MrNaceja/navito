import Fastify from 'fastify';
import staticPlugin from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Instantiate a server
const server = Fastify();

// Register a static server plugin to serve static files
await server.register(staticPlugin, {
  root: [join(__dirname, 'public'), join(__dirname, '../dist')],
  prefix: '/',
  contentType: {
    '.js': 'application/javascript',
    '.html': 'text/html'
  }
});

// Setup a fallback for SPA routing
server.setNotFoundHandler((_, reply) => {
    reply.sendFile('index.html');
});

// Start the server
server.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on: ${address}`);
});