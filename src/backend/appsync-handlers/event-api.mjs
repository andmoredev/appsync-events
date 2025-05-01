import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

const TABLE = 'appsync-events-app-DynamoDBTableName-NBAUU4K2D9NY'

export const onSubscribe = {
  request(event) {
    if (event.info.channel.segments.length > 2) {
      util.error('Invalid Room Name - To Many Segments');
    }

    if(event.info.channel.segments.includes('*')) {
      util.error('Invalid Room Name - Wildcards');
    }

    const channel = event.info.channel.path
    const room = event.info.channel.segments[1]
    const timestamp = util.time;

    ddb.put({
      key: { id: room },
      item: {
        channel,
        id: room,
        timestamp
      }
    });
  },
  response(ctx) {
    const { error, result } = ctx;
    if (error) {
      return util.appendError(error.message, error.type, result);
    }

    return 'Successfully subscribed to channel';
  }
}
