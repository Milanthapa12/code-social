"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { Input } from './input'
import { SearchIcon } from 'lucide-react'

export default function SearchInput() {
    const router = useRouter()
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const q = (form.search as HTMLInputElement).value.trim()
        if (!q) return
        console.log(q, "qerh")
        router.push(`/search?q=${encodeURIComponent(q)}`)
    }
    return (<form onSubmit={handleSubmit} method='GET' action={'/search'}>
        <div className="relative">
            <Input name="search" placeholder='Search' className='pe-10' />
            <SearchIcon className='absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground' />
        </div>
    </form>)
}
