import { useCallback, useEffect, useMemo, useState } from "react"
import { useBoundContext } from "./bound"
import { useBoundValue } from "./bound-value"
import { defaultExtractor } from "./defaultExtractor"
import { createEvent } from "./event"
import { stringToTitleCaseLabel } from "./stringToTitleCaseLabel"
import { withDataBinding } from "./withDataBinding"

export const DontSetValue = Symbol("DontSetValue")

export const boundComponentProperties = createEvent()

boundComponentProperties.on((props, { field }) => {
    props.label ??= stringToTitleCaseLabel(field)
})

export function Binding({ children }) {
    return withDataBinding(<>{children}</>)
}

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

export const B = Bind

export function Bind({
    blur,
    field,
    defaultValue = "",
    changeProp = "onChange",
    valueProp = "value",
    extract = defaultExtractor,
    transformIn = (v) => v,
    transformOut = (v) => v,
    target,
    children
}) {
    const [, setId] = useState(0)
    const context = useBoundContext()
    const { target: boundTarget } = context
    target ??= boundTarget
    if (children?.$$typeof !== Symbol.for("react.element"))
        return <div>{field} Must be bound to a single component</div>

    const fieldToUse = useMemo(() => {
        const result = field ?? children.props.field
        delete children.props.field
        return result
    }, [children])

    const [value, setValue] = useBoundValue(fieldToUse, defaultValue, target)
    const [current, setCurrent] = useState(transformIn(value))
    useEffect(updateCurrentValue, [value])
    const handleBlur = useCallback(_handleBlur, [current])
    const { onBlur } = children.props

    const props = boundComponentProperties.raise(
        {
            ...children.props,
            onBlur: handleBlur,
            [valueProp]: current,
            [changeProp]: (...params) => {
                const result = extract(...params)
                setCurrentValue(result)
            }
        },
        {
            field,
            value: transformOut(current),
            target,
            context,
            valueProp,
            changeProp,
            refresh
        }
    )

    return {
        ...children,
        props
    }

    function setCurrentValue(v) {
        setCurrent(v)
        const transformed = transformOut(v)
        if (value === transformed) return
        if (!blur) {
            setValue(transformed, true)
        }
    }

    function _handleBlur(...params) {
        if (onBlur) {
            onBlur(...params)
        }
        if (blur) {
            const transformed = transformOut(current)
            if (value === transformed) return
            setValue(transformed)
        }
    }

    function updateCurrentValue() {
        setCurrent(transformIn(value))
    }

    function refresh() {
        setId((i) => i + 1)
    }
}
