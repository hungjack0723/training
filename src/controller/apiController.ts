import { Controller, Route, Query, Tags, Get, Response, Path } from 'tsoa'
import { fetchData } from '../service/apiService'
import { CurrencyPair, UnexpectedErrorResponseModel, allowedCurrencyPairs, apiSuccessResponseModel, webSocketApiSuccessResponseModel } from '../model/apiModel'
import { getOhlcData } from '../service/webSocketService'

@Tags('Data')
@Route('data')
export class DataController extends Controller {
  /**
   * @summary 取得資料
   */
  @Get('/')
  @Response<apiSuccessResponseModel>(200)
  @Response<UnexpectedErrorResponseModel>(500)
  public async getData(
    @Query('user') user: number,
  ): Promise<apiSuccessResponseModel> {
      const result = await fetchData(user)
      return result
  }
   /**
   * @summary 取得1 minute OHLC資料
   */
   @Get('/streaming')
   @Response<apiSuccessResponseModel>(200)
   @Response<UnexpectedErrorResponseModel>(500)
   public getOhlcData(
      @Query('currencyPairs') currencyPairs: CurrencyPair,
   ): webSocketApiSuccessResponseModel {
    if (!allowedCurrencyPairs.includes(currencyPairs)) {
        throw new Error('Invalid currency pair')
    }
      const result = getOhlcData(currencyPairs)
      return result
   }
}