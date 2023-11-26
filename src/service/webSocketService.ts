import { MinuteOHLC, Trade, cleanOldOhlcData, updateOhlcData, updateTimestamps } from '../dto/webSocketService.dto'
import dayjs from 'dayjs'
import { connectToWebSocket } from '../util/webSocket'
import logger from '../util/logger'

// ohlc
let ohlcData: Record<string, MinuteOHLC[]> = {}
// timestamp
let pairTimestamps: Record<string, number[]> = {}

const bitmapWs = connectToWebSocket(
  'wss://ws.bitstamp.net',
  () => {
    logger.info('WebSocket connection opened.')
    subscribeToCurrencyPairs(['BTCUSD', 'ETHUSD', 'XRPUSD'])
  },
  (message) => {
    const parsedMessage = JSON.parse(message.toString())
    if (parsedMessage.data && parsedMessage.data.price) {
      processBitstampMessage(parsedMessage)
    }
  },
  () => {
    logger.info('WebSocket connection closed.')
  }
)

export const subscribeToCurrencyPairs = (pairs: string[]) => {
  pairs.forEach((pair) => {
      bitmapWs.send(JSON.stringify({ event: 'bts:subscribe', data: { channel: `live_trades_${pair.toLowerCase()}` } }))
      logger.info(`Subscribed to ${pair}`)
  })
}

export const unsubscribeFromCurrencyPairs = (pairs: string[]) => {
  pairs.forEach((pair) => {
      bitmapWs.send(JSON.stringify({ event: 'bts:unsubscribe', data: { channel: `live_trades_${pair.toLowerCase()}` } }))
      logger.info(`Unsubscribed from ${pair}`)
  })
}

const processBitstampMessage = (parsedMessage: any) => {
  const { data } = parsedMessage

  if (data.price) {
    const { price } = data
    const pair = parsedMessage.channel?.split('_')[2]

    logger.info(`Received message from Bitstamp. ${pair}: ${price}`)

    // update OHLC data
    const timestamp = parseInt(data.timestamp, 10)
    const ohlc = updateMinuteOHLC([{ pair, timestamp, price }], ohlcData, pairTimestamps)

    cleanOldOhlcData({ pair, currentTimestamp: timestamp })
    logger.info(JSON.stringify(ohlc))
  }
}

const updateMinuteOHLC = (trades: Trade[], currentOhlcData: Record<string, MinuteOHLC[]>, pairTimestamps: Record<string, number[]>) => {
  logger.info(`updateMinuteOHLC service: ${JSON.stringify(trades)}`)

const updateTimestamps = (dto: updateTimestamps) => {
    if (!pairTimestamps[dto.pair]) {
      pairTimestamps[dto.pair] = [dto.timestamp]
    }

    const currentDate = pairTimestamps[dto.pair]?.[0] || dayjs().unix()
    const timeDifferenceInSeconds = dto.timestamp - currentDate

    // 超過60秒，清空數組
    if (timeDifferenceInSeconds > 60) {
      pairTimestamps[dto.pair] = []
    } else {
      pairTimestamps[dto.pair].push(dto.timestamp)
    }
}

const updateOhlcData = (dto: updateOhlcData) => {
    if (!currentOhlcData[dto.pair] || dto.timestamp - currentOhlcData[dto.pair]?.[0]?.timestamp > 60) {
      if (!currentOhlcData[dto.pair]) {
        currentOhlcData[dto.pair] = []
      }

      currentOhlcData[dto.pair].push({
        timestamp: dto.timestamp,
        open: dto.price,
        high: dto.price,
        low: dto.price,
        close: dto.price
      })
    } else {
      const currentMinute = currentOhlcData[dto.pair][currentOhlcData[dto.pair].length - 1]
      currentMinute.timestamp = dto.timestamp
      currentMinute.high = Math.max(currentMinute.high, dto.price)
      currentMinute.low = Math.min(currentMinute.low, dto.price)
      currentMinute.close = dto.price
    }
  }

  for (const trade of trades) {
    const { pair, timestamp, price } = trade
    updateTimestamps({pair, timestamp})
    updateOhlcData({pair, timestamp, price})
  }

  return currentOhlcData
}


const cleanOldOhlcData = (dto: cleanOldOhlcData) => {
  logger.info(`cleanOldOhlcData service: ${JSON.stringify(dto)}`)
  // 檢查是否存在，不存在則初始化
  if (!ohlcData[dto.pair]) {
    ohlcData[dto.pair] = []
    return
  }
  const cutoffTimestamp = dto.currentTimestamp - (15 * 60) // 15 分鐘前的 timestamp
  ohlcData[dto.pair] = ohlcData[dto.pair].filter((data) => data.timestamp >= cutoffTimestamp)
}


