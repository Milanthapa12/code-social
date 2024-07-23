"use client"

import { Session, User } from "lucia"
import React, { createContext, useContext } from "react"

interface ISessionContext {
    user: User,
    session: Session
}

const SessionContext = createContext<ISessionContext | null>(null)

export default function SessionProvider({
    children,
    value
}: React.PropsWithChildren<{ value: ISessionContext }>) {
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
    const context = useContext(SessionContext)
    if (!context) throw new Error("useSession hooks must be used within SessionProvider")
    return context
}