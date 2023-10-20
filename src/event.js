import { useLayoutEffect, useMemo } from "react"

export function createEvent() {
    let handlers = new Set()
    let timer
    return {
        on,
        off,
        once,
        raise,
        raiseAsync,
        raiseOnce,
        useEvent,
        data: {}
    }

    function useEvent(handler, deps = []) {
        useLayoutEffect(() => on(handler), deps)
    }

    function raiseOnce(...params) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            raise(...params)
        }, 20)
    }

    function on(handler) {
        handlers.add(handler)
        return () => off(handler)
    }

    function off(handler) {
        handlers = handlers.delete(handler)
    }

    function once(handler) {
        const off = on((...params) => {
            handler(...params)
            off()
        })
    }

    function raise(...params) {
        handlers.forEach((handler) => handler(...params))
        return params[0]
    }

    async function raiseAsync(...params) {
        await Promise.all(
            [...handlers].map((handler) => Promise.resolve(handler(...params)))
        )
        return params[0]
    }
}
