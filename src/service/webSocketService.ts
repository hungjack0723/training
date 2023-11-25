import { MinuteOHLC, Trade, cleanOldOhlcData, updateOhlcData, updateTimestamps } from '../dto/webSocketService.dto'
import dayjs from 'dayjs'
import { connectToWebSocket } from '../util/webSocket'

// ohlc
let ohlcData: Record<string, MinuteOHLC[]> = {}
// timestamp
let pairTimestamps: Record<string, number[]> = {}

const bitmapWs = connectToWebSocket(
  'wss://ws.bitstamp.net',
  () => {
    console.log('WebSocket connection opened.')
    subscribeToCurrencyPairs(['BTCUSD', 'ETHUSD', 'XRPUSD'])
  },
  (message) => {
    const parsedMessage = JSON.parse(message.toString())
    if (parsedMessage.data && parsedMessage.data.price) {
      processBitstampMessage(parsedMessage)
    }
  },
  () => {
    console.log('WebSocket connection closed.')
  }
)

export const subscribeToCurrencyPairs = (pairs: string[]) => {
  pairs.forEach((pair) => {
      bitmapWs.send(JSON.stringify({ event: 'bts:subscribe', data: { channel: `live_trades_${pair.toLowerCase()}` } }))
      console.log(`Subscribed to ${pair}`)
  })
}

export const unsubscribeFromCurrencyPairs = (pairs: string[]) => {
  pairs.forEach((pair) => {
      bitmapWs.send(JSON.stringify({ event: 'bts:unsubscribe', data: { channel: `live_trades_${pair.toLowerCase()}` } }))
      console.log(`Unsubscribed from ${pair}`)
  })
}

const processBitstampMessage = (parsedMessage: any) => {
  const { data } = parsedMessage

  if (data.price) {
    const { price } = data
    const pair = parsedMessage.channel?.split('_')[2]

    console.log(`Received message from Bitstamp. ${pair}: ${price}`)

    // update OHLC data
    const timestamp = parseInt(data.timestamp, 10)
    const ohlc = updateMinuteOHLC([{ pair, timestamp, price }], ohlcData, pairTimestamps)

    cleanOldOhlcData({ pair, currentTimestamp: timestamp })
    console.log(ohlc)
  }
}

const updateMinuteOHLC = (trades: Trade[], currentOhlcData: Record<string, MinuteOHLC[]>, pairTimestamps: Record<string, number[]>) => {
  console.info(new Date())
  console.log(trades)

const updateTimestamps = (dto: updateTimestamps) => {
    if (!pairTimestamps[dto.pair]) {
      pairTimestamps[dto.pair] = [dto.timestamp]
    }

    const currentDate = pairTimestamps[dto.pair]?.[0] || dayjs().unix()
    const timeDifferenceInSeconds = dto.timestamp - currentDate
    console.log('timeDifferenceInSeconds', timeDifferenceInSeconds)

    if (timeDifferenceInSeconds > 60) {
      pairTimestamps[dto.pair] = []
      console.log('超過 60 秒，清空數組')
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
  // 檢查是否存在，不存在則初始化
  if (!ohlcData[dto.pair]) {
    ohlcData[dto.pair] = []
    return
  }
  const cutoffTimestamp = dto.currentTimestamp - (15 * 60) // 15 分鐘前的 timestamp
  console.log('cutoffTimestamp', cutoffTimestamp)
  ohlcData[dto.pair] = ohlcData[dto.pair].filter((data) => data.timestamp >= cutoffTimestamp)
}


