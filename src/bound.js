import { createContext, useContext } from "react"

const BoundContext = createContext({})
const Also = Symbol("Also")

/**
 * A special error type to signal cancellation.
 * Throw an instance of Cancel to skip any former processing during an `also` merge
 * without raising an error.
 * @extends Error
 */
export class Cancel extends Error {
    constructor() {
        super()
        this.message = "Cancel"
    }
}

/**
 * Custom hook to access the current value of the BoundContext.
 *
 * The `BoundContext` typically contains properties and values that are bound
 * to it using the `<Bound>` component. The context may contain data that
 * components within the `<Bound>` tree can use or modify.
 *
 * Potential properties within the context can include:
 * - `target`: An object that other components might use with the `useBoundValue` hook
 *   to find and modify specific properties within.
 * - Functional properties: Functions that are bound to the context and can be merged
 *   with other functions using the `also` utility.
 * - Any other properties passed down to the `BoundContext.Provider` via the `<Bound>` component.
 *
 * @returns {Object} The current value of the `BoundContext`.
 * @example
 * const { target, someFunction } = useBoundContext();
 */
export function useBoundContext() {
    return useContext(BoundContext)
}

/**
 * A component that binds data from a context to the properties passed in.
 *
 * The component provides a new context to its descendants that includes the
 * bound properties. The properties passed to the `Bound` component will
 * extend or overwrite properties from any existing context. If a property
 * passed to the `Bound` component has the same name as a property in the
 * existing context:
 * - Non-functional properties from `props` will overwrite those in the existing context.
 * - Functional properties that use the `also` utility will be merged with the
 *   existing function in the context. When the merged function is called,
 *   both the new function (from `props`) and the existing function (from context)
 *   will be executed. The results of both functions can then be merged using the
 *   merge function provided to the `also` utility.
 *
 * This behavior allows for properties in the `Bound` context to be extended or
 * enhanced without completely replacing them, especially when using the `also`
 * utility for functions.
 *
 * @param {Object} props - The properties to bind to the context.
 * @param {React.ReactNode} props.children - The children to be rendered within the `BoundContext.Provider`.
 * @param {Object.<string, *>} props.otherProps - Other properties to be passed down to the `BoundContext.Provider`.
 * @returns {React.Element} The `BoundContext.Provider` element wrapping the children, with a value that includes the bound properties.
 *
 * @example
 * // Using Bound to extend the context with a new property.
 * <Bound target={someObject}>
 *   <OtherBoundComponents />
 * </Bound>
 *
 * @example
 * // Using Bound with the `also` utility to extend a function in the context.
 * const enhancedFunction = also(
 *   (param) => { console.log('New function:', param); },
 *   (a, b) => { console.log('Merged results:', a, b); }
 * );
 *
 * <Bound existingFunction={enhancedFunction}>
 *   <OtherBoundComponents />
 * </Bound>
 */
export function Bound({ children, ...props }) {
    const context = useBoundContext()
    for (const [key, value] of Object.entries(props)) {
        if (value?.[Also]) {
            if (typeof context[key] === "function") {
                props[key] = (...params) => {
                    try {
                        const a = value(...params)
                        const b = context[key](...params)
                        if (a?.then || b?.then) {
                            return mergeAsyncResults(value[Also], a, b)
                        } else {
                            return value[Also](a, b)
                        }
                    } catch (e) {
                        if (!(e instanceof Cancel)) {
                            throw e
                        }
                        return a
                    }
                }
            }
        }
    }
    const newContext = { ...context, ...props }
    return typeof children === "function" ? (
        <BoundContext.Provider value={newContext}>
            {children(newContext)}
        </BoundContext.Provider>
    ) : (
        <BoundContext.Provider value={newContext}>
            {children}
        </BoundContext.Provider>
    )

    async function mergeAsyncResults(mergeFunction, a, b) {
        const r1 = await a
        const r2 = await b
        return mergeFunction(r1, r2)
    }
}

/**
 * A utility function to create a function that can also merge its results with the results of the function
 * it is merged with.
 *
 * @param {(...args: any[]) => any} fn - The function to be called.
 * @param {(a: any, b: any) => any} [merge=(a, b) => a] - A function to merge the results of `fn` and the context function.
 * Will only be called if there are results to merge with.
 * @returns {(...args: any[]) => any} - A new function with an attached merge method.
 * @throws Will throw an error if `fn` is not a function.
 */
export function also(fn, merge = (a, b) => a) {
    if (typeof fn !== "function" || typeof merge !== "function")
        throw new Error("also must be called with functions as parameters")
    fn[Also] = merge
    return fn
}
