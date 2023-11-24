import fetch from 'node-fetch'

export const fetchData = async (userId: number) => {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')

    if (!response.ok) throw new Error('Failed to fetch data')

    const data = await response.json() as number[]
    const result = data.filter(item => item % userId === 0)

    return { result }
  }
  