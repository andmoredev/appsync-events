import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

export const onSubscribe = {
  request(ctx) {
        if (ctx.info.channel.segments.length > 2) {
          util.error('Invalid Room Name - To Many Segments');
        }

        if(ctx.info.channel.segments.includes('*')) {
          util.error('Invalid Room Name - Wildcards');
        }

        const channel = ctx.info.channel.path
        const room = ctx.info.channel.segments[1]
        const timestamp = util.time.nowEpochMilliSeconds();

        const id = util.autoId();
        return ddb.put({
            key: { id },
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