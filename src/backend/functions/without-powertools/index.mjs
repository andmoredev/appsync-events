export const handler = async (event, context) => {
  console.log('Event:', event.events);
  return {
    events: event.events
  };
};