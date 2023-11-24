import { Controller, Route, Query, Tags, Get, Response } from 'tsoa'
import { fetchData } from '../service/apiService'
import { UnexpectedErrorResponseModel, apiSuccessResponseModel } from '../model/apiModel'

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
  }