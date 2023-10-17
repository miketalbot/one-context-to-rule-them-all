import { useCallback, useLayoutEffect, useMemo, useState } from "react"
import { useBoundContext } from "./bound"

const handlers = {}

/**
 * Hook to traverse a nested object and retrieve a reference to a deep target and its key.
 * This is useful for working with nested objects and wanting to bind to a deeply nested value.
 * @param {string} key - A dot-separated string representing the path to the deep value.
 * @returns {Array} A tuple containing the deep target object and the final key to access the value.
 */
export function useDeepTargetAndKey(key, activeTarget) {
    let { target } = useBoundContext()
    activeTarget ??= target
    return useMemo(getTargetAndKey, [activeTarget, key])

    /**
     * Traverses the target object using the provided path and retrieves the
     * final nested object and its key.
     * @returns {Array} A tuple containing the deep target object and the final key.
     */
    function getTargetAndKey() {
        const parts = key.split(".").reverse()
        while (parts.length > 1) {
            const subKey = parts.pop()
            if (!activeTarget[subKey]) {
                activeTarget[subKey] = {}
            }
            activeTarget = activeTarget[subKey]
        }
        return [activeTarget, parts.pop()]
    }
}

/**
 * Hook to bind to a specific value within a nested object and provide
 * mechanisms to get and set its value.
 * This is useful for creating reactive bindings to specific properties within a complex object.
 * @param {string} path - The path to the desired value within the nested object.
 * @param {*} defaultValue - A default value to return if the desired value is not found.
 * @returns {Array} A tuple containing the current value (or default value) and a function to set its value.
 */
export function useBoundValue(path, defaultValue, target) {
    const [, setId] = useState(0)
    const { onChange = () => {} } = useBoundContext()
    const [activeTarget, key] = useDeepTargetAndKey(path, target)
    const setValue = useCallback(handleSetValue, [activeTarget, key])

    useLayoutEffect(() => {
        const keyHandlers = (handlers[key] ??= [])
        keyHandlers.push(handleChange)
        return () => {
            keyHandlers.splice(keyHandlers.indexOf(handleChange), 1)
        }
    }, [activeTarget])

    return [(activeTarget[key] ??= defaultValue), setValue]

    /**
     * Sets a new value for the specified target and key. If the value is a function,
     * it is invoked with the current value to determine the new value.
     * This also notifies all registered handlers of the change.
     * @param {*} value - The new value or a function to determine the new value.
     */
    function handleSetValue(value) {
        if (typeof value === "function") {
            value = value(activeTarget[key])
        }
        if (activeTarget[key] === value) return
        activeTarget[key] = value
        const keyHandlers = handlers[key] ?? []
        for (const handler of keyHandlers) {
            handler(activeTarget, value)
        }
        onChange(activeTarget, value)
    }

    /**
     * Reacts to changes in the target by triggering a re-render.
     * This ensures that components using this hook will update when the target changes.
     * @param {Object} changeTarget - The object that experienced the change.
     */
    function handleChange(changeTarget) {
        if (changeTarget !== activeTarget) return
        setId((i) => i + 1)
    }
}
