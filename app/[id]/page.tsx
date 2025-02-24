'use client'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
    const router = useRouter()
    const params = useParams<{ id: string }>()

    const getFullUrl = async () => {
        const result = await fetch(`/api/url?id=${params.id}`)
        const json = await result.json()

        router.push(json.url)
    }

    useEffect(() => {
        getFullUrl()
    }, [params.id])

    return <></>
}