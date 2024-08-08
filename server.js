const fastify = require('fastify')({ logger: true });
const sequelize = require('./config/database');
const taskRoutes = require('./routes/tasks');

// CORS Middleware
fastify.register(require('@fastify/cors'), {
  origin: "*",
});

// Database Connection
sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco de dados com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

// Sync Tables
sequelize.sync()
  .then(() => {
    console.log('Tabelas sincronizadas!');
  })
  .catch(err => {
    console.error('Erro ao sincronizar as tabelas:', err);
  });

// Register Routes
fastify.register(taskRoutes);

// Default Route
fastify.get('/', async (request, reply) => {
  reply.send({ message: 'API funcionando!' });
});

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor rodando na porta 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
