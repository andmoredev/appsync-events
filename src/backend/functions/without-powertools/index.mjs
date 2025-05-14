import { initializePowertools, logger } from '../shared/lambda-powertools.mjs';
import { AppSyncEventsResolver } from '@aws-lambda-powertools/event-handler/appsync-events';

const app = new AppSyncEventsResolver();

app.onPublish("/AndMoreChat/*", async (payload) => {
  const response = {
    processed: true,
    original_payload: payload
  };
  return response;
});

app.onSubscribe("/AndMoreChat/*", async (payload) => {
});

export const handler = initializePowertools(async (event, context) => {
  return app.resolve(event, context);
});