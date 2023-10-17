import { useMemo } from "react"
import { useBoundValue } from "./bound-value"

export const DontSetValue = Symbol("DontSetValue")

export function bind(
    component,
    { extract, changeProp, valueProp, labelProp } = {
        extract: defaultExtractor,
        changeProp: "onChange",
        valueProp: "value",
        labelProp: "label"
    }
) {
    return function BoundComponent({ field, defaultValue = "", ...props }) {
        const [value, setValue] = useBoundValue(field, defaultValue)
        if (labelProp) {
            props[labelProp] ??= stringToTitleCaseLabel(field)
        }
        return (
            <component.type
                {...component.props}
                {...props}
                {...{
                    [valueProp]: value,
                    [changeProp]: (...params) => {
                        const result = extract(...params)
                        if (result !== DontSetValue) setValue(result)
                    }
                }}
            />
        )
    }
}

function stringToTitleCaseLabel(inputString) {
    // Split the input string by spaces and camelCase boundaries
    const words = inputString.split(/(?=[A-Z])|\s+/)

    // Capitalize the first letter of each word and join them
    const titleCaseLabel = words
        .map((word) => {
            // Handle acronyms (e.g., "HTTP" or "XML")
            if (word === word.toUpperCase()) {
                return word
            }

            // Capitalize the first letter of each word
            return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(" ")

    return titleCaseLabel
}

function isReactEvent(value) {
    return (
        typeof value === "object" && // Check if it's an object
        "target" in value && // Check for the 'target' property
        "type" in value && // Check for the 'type' property
        typeof value.preventDefault === "function" // Check for the 'preventDefault' method
    )
}

function defaultExtractor(e, v) {
    if (v !== undefined) return v
    if (e?.target?.value !== undefined) return e.target.value
    if (!isReactEvent(e)) return e
    return DontSetValue
}

export const B = Bind

export function Bind({
    field,
    defaultValue = "",
    changeProp = "onChange",
    valueProp = "value",
    extract = defaultExtractor,
    children
}) {
    if (children?.$$typeof !== Symbol.for("react.element"))
        return <div>{field} Must be bound to a single component</div>

    const fieldToUse = useMemo(() => {
        const result = field ?? children.props.field
        delete children.props.field
        return result
    }, [children])

    const [value, setValue] = useBoundValue(fieldToUse, defaultValue)
    return {
        ...children,
        props: {
            ...children.props,
            [valueProp]: value,
            [changeProp]: (...params) => {
                const result = extract(...params)
                if (result !== DontSetValue) setValue(result)
            }
        }
    }
}

export function withDataBinding(param) {
    if(typeof param === "function") {
        return function BoundComponent(...params) {
            return withDataBinding(param(...params))
        }
    }
    return scan(param)

    function scan(element) {
        if(!element) return element
        
        
        for(const child of element) {
            scan(child)
            const {field, defaultValue, valueProp = "value", changeProp = "onChange", extract = defaultExtractor} = child.props
            if(field) {
                
            }
        }
    }
    
}