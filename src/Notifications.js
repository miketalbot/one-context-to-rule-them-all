import React, { useState, useEffect } from "react"
import { Snackbar } from "@mui/material"
import { useBoundValue } from "./bound-value"

export function Notifications() {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useBoundValue("message")
    useEffect(() => {
        setOpen(!!message)
    }, [message])
    return (
        <Snackbar
            variant="info"
            onClose={() => {
                setOpen(false)
                setMessage(undefined)
            }}
            open={open}
            message={message}
            autoHideDuration={5000}
        />
    )
}
