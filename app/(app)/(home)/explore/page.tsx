"use client"
import { useEffect, useState } from "react"

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setData)
  }, [])

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}
