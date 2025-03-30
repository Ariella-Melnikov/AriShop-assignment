export const fetchILSToUSDRate = async (): Promise<number> => {
    try {
      const res = await fetch('https://api.exchangerate.host/latest?base=ILS&symbols=USD')
      const data = await res.json()
      return data.rates?.USD ?? 0.28
    } catch (err) {
      console.error('Failed to fetch exchange rate:', err)
      return 0.28 // fallback default
    }
  }