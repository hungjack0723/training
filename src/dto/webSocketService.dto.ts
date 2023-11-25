interface OHLCEntry {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
  }
  
export interface OHLCData {
    [pair: string]: OHLCEntry[]
}

export interface Trade {
    pair: string;
    timestamp: number;
    price: number;
}

export interface MinuteOHLC {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
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