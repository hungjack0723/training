export interface OHLCEntry {
    /**
     * 時間戳記
     */
    timestamp: number
    /**
     * 每分鐘的第一筆成交價格
     */
    open: number
    /**
     * 每分鐘的最高成交價格
     */
    high: number
     /**
     * 每分鐘的最低成交價格
     */
    low: number
     /**
     * 每分鐘的最後一筆成交價格
     */
    close: number
}
  
export interface OHLCData {
    [pair: string]: OHLCEntry[]
}

export interface Trade {
    pair: string
    timestamp: number
    price: number
}

export interface cleanOldOhlcData {
  pair: string
  currentTimestamp: number
}

export interface  updateOhlcData {
  pair: string
  timestamp: number
  price: number
}

export interface updateTimestamps {
  pair: string
  timestamp: number
}