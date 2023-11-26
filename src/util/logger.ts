import winston from 'winston'

// 建立一個logger
const logger = winston.createLogger({
  level: 'info', // 可以是 'info', 'warn', 'error' 等
  format: winston.format.combine(
    winston.format.timestamp(), // 添加時間戳記
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    new winston.transports.Console(), // 在控制台輸出
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }) // 將 error 級別的日誌寫入文件
  ]
})

export default logger
