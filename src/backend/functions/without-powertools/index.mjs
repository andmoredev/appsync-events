import { initializePowertools, logger } from '../shared/lambda-powertools.mjs';



export const handler = initializePowertools(async (event, context) => {
  logger.info('Event: ', event);
  logger.info('Context: ', context);

  const response = {
    processed: true,
    original_payload: event
  };

  return response;
});