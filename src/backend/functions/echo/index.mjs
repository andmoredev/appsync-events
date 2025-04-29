import { initializePowertools, logger } from '../shared/lambda-powertools.mjs';
import { AppSyncEventsResolver } from '@aws-lambda-powertools/event-handler/appsync-events';

const app = new AppSyncEventsResolver();

app.onPublish('/EventApiChannelNamespace/channel', async (payload) => {
  const response = {
    processed: true,
    original_payload: payload,
  };

  console.log('Response:', response);
  return response;
});

export const handler = initializePowertools(async (event, context) => {
  return app.resolve(event, context);
});