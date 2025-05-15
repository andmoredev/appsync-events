import { initializePowertools, logger } from '../shared/lambda-powertools.mjs';

export const handler = initializePowertools(async (event, context) => {
  logger.info('Event:', event);
  return event.events;
});