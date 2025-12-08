console.log(process.env.NEXT_PUBLIC_API_BASE_URL)

export const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";