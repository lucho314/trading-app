"use client"

import { useState, useEffect, useCallback } from "react"
import { technicalIndicatorGetAll } from "@/app/actions/technical-indicator/get-all"
import { IndicatorsGrid } from './indicators-grid';
import { Indicator } from "@/app/type";


interface Props {
  initialIndicators: Indicator[]
}

export default function IndicatorsList({ initialIndicators }: Props) {
  const [indicators, setIndicators] = useState(initialIndicators)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)


 const loadMore = useCallback(async () => {
  if (loading || !hasMore) return
  setLoading(true)
  try {
    const nextPage = page + 1
    const data = await technicalIndicatorGetAll({ page: nextPage, pageSize: 5 })
    if (!data || data.length === 0) {
      setHasMore(false)
    } else {
      setIndicators((prev) => [...prev, ...data])
      setPage(nextPage)
    }
  } finally {
    setLoading(false)
  }
}, [loading, hasMore, page])


useEffect(() => {
  const onScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      loadMore()
    }
  }

  window.addEventListener("scroll", onScroll)
  return () => window.removeEventListener("scroll", onScroll)
}, [loadMore])

  return (
    <div>``
      <IndicatorsGrid indicators={indicators} />
      {loading && <p className="text-center py-4">Cargando...</p>}
      {!hasMore && (
        <p className="text-center py-4 text-muted-foreground">No hay más indicadores</p>
      )}
    </div>
  )
}
