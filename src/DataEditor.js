import React from "react"
import TextField from "@mui/material/TextField"

import { Binding } from "./bind"

export function DataEditor() {
    return (
        <Binding>
            <TextField
                yup="string.required"
                field="values"
                blur
                defaultValue="1,2,3,4,5,6,7,8"
                size="small"
                variant="outlined"
                fullWidth
            />
        </Binding>
    )
}
