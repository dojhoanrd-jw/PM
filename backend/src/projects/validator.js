const { z } = require('zod');

const createProjectSchema = z.object({
  name: z
    .string({ message: 'Project name is required' })
    .min(1, 'Project name cannot be empty')
    .max(100, 'Project name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .default(''),
  status: z
    .enum(['active', 'paused'], { message: 'Status must be active or paused' })
    .default('active'),
});

module.exports = { createProjectSchema };
