const crypto = require('crypto');
const { PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLE_NAME } = require('../shared/dynamo');
const { success, error } = require('../shared/response');
const { AppError } = require('../shared/errors');
const { withAuth } = require('../auth/middleware');
const { createProjectSchema } = require('./validator');

const create = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    const result = createProjectSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues[0]?.message || 'Invalid data';
      return error(message, 400);
    }

    const { name, description, status } = result.data;
    const { userId } = event.user;
    const projectId = crypto.randomUUID();

    const project = {
      PK: userId,
      SK: `PROJECT#${projectId}`,
      projectId,
      name,
      description,
      status,
      type: 'project',
      createdAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({ TableName: TABLE_NAME, Item: project })
    );

    return success({ project }, 201);
  } catch (err) {
    if (err instanceof AppError) {
      return error(err.message, err.statusCode);
    }
    console.error('Create project error:', err);
    return error('Internal server error', 500);
  }
};

const list = async (event) => {
  try {
    const { userId } = event.user;

    const { Items = [] } = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': userId,
          ':sk': 'PROJECT#',
        },
      })
    );

    return success({ projects: Items });
  } catch (err) {
    if (err instanceof AppError) {
      return error(err.message, err.statusCode);
    }
    console.error('List projects error:', err);
    return error('Internal server error', 500);
  }
};

module.exports = {
  create: withAuth(create),
  list: withAuth(list),
};
