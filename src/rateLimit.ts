import rateLimit from 'express-rate-limit'


function calculateRemainingRequests(res: any) {
    const limit = res.getHeader('x-ratelimit-limit') as number || 0
    const remaining = res.getHeader('x-ratelimit-remaining') as number || 0
    return limit - remaining
}
  

// Rate limiting
export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // max requests per minute per IP
    handler: (req, res) => {
        const remainingRequests = calculateRemainingRequests(res)
        res.status(429).json({ ip: req.ip, id: remainingRequests })
    },
})
  
// Apply separate rate limiting for user ID
export const userLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // max requests per minute per user ID
    handler: (req, res) => {
     const remainingRequests = calculateRemainingRequests(res)
        res.status(429).json({ ip: req.ip, requests: remainingRequests })
    },
})