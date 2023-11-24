export interface apiSuccessResponseModel {
    result: number[]
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