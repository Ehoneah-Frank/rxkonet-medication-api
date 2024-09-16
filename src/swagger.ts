import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'rxkonet-medication-api',
      version: '1.0.0',
      description: 'API for managing medications and related resources',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1', // Change to your server URL
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };