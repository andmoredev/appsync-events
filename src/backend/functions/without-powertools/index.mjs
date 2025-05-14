import { initializePowertools } from '../shared/lambda-powertools.mjs';

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