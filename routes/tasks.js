const Task = require('../Models/Task');

async function taskRoutes(fastify, options) {
  fastify.post('/tasks', {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          color: { type: 'string' },
          favorite: { type: 'boolean' },
        },
        required: ['title'],
      },
    },
  }, async (request, reply) => {
    try {
      const { title, description, color, favorite } = request.body;
      const newTask = await Task.create({ title, description, color, favorite });
      reply.code(201).send(newTask);
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao criar tarefa' });
    }
  });

  fastify.get('/tasks', async (request, reply) => {
    try {
      const tasks = await Task.findAll({ order: [['favorite', 'DESC']] });
      reply.send(tasks);
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao buscar tarefas' });
    }
  });

  fastify.get('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const task = await Task.findByPk(id);
      if (task) {
        reply.send(task);
      } else {
        reply.code(404).send({ error: 'Tarefa não encontrada' });
      }
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao buscar tarefa' });
    }
  });

  fastify.put('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { title, description, color, favorite } = request.body;
      const task = await Task.findByPk(id);
      if (task) {
        await task.update({ title, description, color, favorite });
        reply.send(task);
      } else {
        reply.code(404).send({ error: 'Tarefa não encontrada' });
      }
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao atualizar tarefa' });
    }
  });

  fastify.delete('/tasks/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const task = await Task.findByPk(id);
      if (task) {
        await task.destroy();
        reply.send({ message: 'Tarefa deletada com sucesso' });
      } else {
        reply.code(404).send({ error: 'Tarefa não encontrada' });
      }
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao deletar tarefa' });
    }
  });
}

module.exports = taskRoutes;
