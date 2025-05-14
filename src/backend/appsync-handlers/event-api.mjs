import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

export const onSubscribe = {
  request(event) {
    if (event.info.channel.segments.length > 2) {
      util.error('Invalid Room Name - Too Many Segments');
    }

    if (event.info.channel.segments.includes('*')) {
      util.error('Invalid Room Name - Wildcards');
    }

    if(!event.identity.groups || event.identity.groups?.includes("TestGroup")) {
      util.unauthorized();
    }

    const channel = event.info.channel.path
    const room = event.info.channel.segments[1]
    const timestamp = util.time.nowEpochMilliSeconds();

    return ddb.put({
      key: { id: room },
      item: {
        id: room,
        channel,
        timestamp
      }
    });
  },
  response(ctx) {
    return ctx.result;
  }
}