import React from "react"
import TextField from "@mui/material/TextField"
import { useBoundValue } from "./bound-value"
import { B, Bind, bind } from "./bind"

const BoundTextField = bind(
    <TextField fullWidth variant="outlined" size="small" />
)

export function DataEditor() {
    return withDataBinding(
        <>
            
                <TextField
                field="values"
                defaultValue="1,2,3,4,5,6,7,8"
                    size="small"
                    label="Data"
                    variant="outlined"
                    fullWidth
                />
            
            <BoundTextField field="valuesStuff" />
        </>
    )
}
