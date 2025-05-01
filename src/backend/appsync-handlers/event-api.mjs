import * as ddb from '@aws-appsync/utils/dynamodb'
import { util } from '@aws-appsync/utils'

const TABLE = 'appsync-events-app-DynamoDBTableName-78A9Z78JKDWE'

export const onPublish = {
  request(ctx) {
    const channel = ctx.info.channel.path
    const timestamp = util.time.nowISO8601()
    return ddb.batchPut({
      tables: {
        [TABLE]: ctx.events.map(({id, payload}) => ({
          channel, id, timestamp, ...payload,
        })),
      },
    })
  },
  response(ctx) {
    return ctx.result.data[TABLE].map(({ id, ...payload }) => ({ id, payload }))
  },
}