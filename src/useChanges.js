import { useLayoutEffect } from "react"
import { useBoundValue, allChanges } from "./bound-value"

/**
 * Hook to register and listen for changes on a specific target.
 * The target is determined by the `useBoundValue` hook. When a change occurs
 * on the specified target, the provided callback is invoked.
 * @param {Function} callback - The callback to be called when the target changes.
 */

export function useChanges(callback) {
    const { target } = useBoundValue()
    useLayoutEffect(() => {
        allChanges.push(change)
        return () => allChanges.splice(allChanges.indexOf(change, 1))

        /**
         * Registers a change on the target and invokes the callback if the
         * change target matches the desired target.
         * @param {Object} changeTarget - The object that experienced the change.
         * @param {*} value - The new value of the change target.
         */
        function change(changeTarget, value) {
            if (changeTarget === target) callback(target, value)
        }
    }, [callback, target])
}
