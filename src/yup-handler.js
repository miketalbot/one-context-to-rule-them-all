import { useEffect, useRef, useState } from "react"
import * as yup from "yup"
import { boundComponentProperties } from "./bind"
import { Bound } from "./bound"
import { createEvent } from "./event"
boundComponentProperties.on(addYupProperties)

export function Yup({ onChange = () => {}, children, ...props }) {
    const [yupContext] = useState(createEvent)
    const lastResult = useRef()
    yupContext.useEvent(change, [onChange])
    return (
        <Bound {...props} yupContext={yupContext}>
            {children}
        </Bound>
    )

    function change() {
        const isSet = !!Object.keys(yupContext.data).length
        if (isSet !== lastResult.current) {
            lastResult.current = isSet
            onChange(isSet)
        }
    }
}

let yupId = 0

function addYupProperties(properties, { value, field, context }) {
    const [id] = useState(() => yupId++)
    const yupContext = (context.yupContext ??= createEvent())

    useEffect(() => {
        return () => delete yupContext.data[id]
    }, [])

    if (properties.yup) {
        const parsed = properties.yup
            .split(".")
            .map((part) => (!part.includes(")") ? `${part}()` : `${part}`))
            .join(".")
        // eslint-disable-next-line no-new-func
        const yupFn = new Function(
            "value",
            "yup",
            `return yup.${parsed}${
                properties.typeError
                    ? `.typeError("${properties.typeError}")`
                    : ""
            }.validateSync(value)`
        )
        properties.error = false
        properties.yupHelperText ??= "helperText"
        if (properties.yupHelperText) {
            properties[properties.yupHelperText] = undefined
        }
        const wasSet = yupContext.data[id]
        delete yupContext.data[id]
        try {
            yupFn(value, yup)
            if (wasSet) {
                yupContext.raiseOnce()
            }
        } catch (e) {
            yupContext.data[id] = e
            properties.error = true
            if (properties.yupHelperText) {
                properties[properties.yupHelperText] = e.message
            }
            if (!wasSet) {
                yupContext.raiseOnce()
            }
        }

        delete properties.yup
    }
}
