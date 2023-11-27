import { OHLCEntry } from "../dto/webSocketService.dto"

export interface apiSuccessResponseModel {
    result: number[]
}

export interface webSocketApiSuccessResponseModel {
  result: OHLCEntry[]
}

export interface UnexpectedErrorResponseModel {
  /**
  * 未知錯誤
  */
  status: string
  /**
    * 錯誤訊息
  */
  message: string
}

export enum CurrencyPair {
  BTCUSD = 'btcusd',
  BTCEUR = 'btceur',
  BTCGBP = 'btcgbp',
  BTCPAX = 'btcpax',
  GBPUSD = 'gbpusd',
  EURUSD = 'eurusd',
  XRPUSD = 'xrpusd',
  XRPEUR = 'xrpeur',
  XRPBTC = 'xrpbtc',
  XRPGPB = 'xrpgbp',
}

export const allowedCurrencyPairs: CurrencyPair[] = [
  CurrencyPair.BTCUSD,
  CurrencyPair.BTCEUR,
  CurrencyPair.BTCGBP,
  CurrencyPair.BTCPAX,
  CurrencyPair.GBPUSD,
  CurrencyPair.EURUSD,
  CurrencyPair.XRPUSD,
  CurrencyPair.XRPEUR,
  CurrencyPair.XRPBTC,
  CurrencyPair.XRPGPB,
]