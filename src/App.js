import React, { useState, useCallback } from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import { Bound, also } from "./bound"

import ring from "./ring.png"
import { useBoundValue } from "./bound-value"
import { Notifications } from "./Notifications"
import { ChartComponent } from "./ChartComponent"
import { SelectedChart } from "./SelectedChart"

const OneBoundContextApp = () => {
    const [state] = useState(() =>
        JSON.parse(localStorage.getItem("stored") ?? "{}")
    )
    const store = useCallback(storeInLocalStorage, [state])

    return (
        <Bound onChange={store} target={state} root={state} chartHeight={180}>
            <Content />
        </Bound>
    )

    function storeInLocalStorage() {
        localStorage.setItem("stored", JSON.stringify(state))
    }
}

function Content() {
    const [, setMessage] = useBoundValue("message")
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Avatar sx={{ width: 56, height: 56, mr: 2 }} src={ring} />
                    <Typography variant="subtitle1">
                        One Context to Rule Them All
                    </Typography>
                    <Box flex={1} />
                </Toolbar>
            </AppBar>
            <Notifications />

            <Bound
                chartOptions={{
                    colors: ["#aa3922"]
                }}
            >
                <Grid container spacing={3} style={{ padding: "20px" }}>
                    <Grid item xs={4}>
                        <ChartComponent chart="chart1" />
                    </Grid>
                    <Grid item xs={4}>
                        <Bound
                            type="line"
                            chartOptions={{
                                colors: ["#69aa22"]
                            }}
                        >
                            <ChartComponent chart="chart2" />
                        </Bound>
                    </Grid>

                    <Grid item xs={4}>
                        <Bound type="radar">
                            <ChartComponent chart="chart3" />
                        </Bound>
                    </Grid>
                    <Bound
                        onChange={also(setSnackbar)}
                        type="line"
                        chartHeight={300}
                        chartOptions={{
                            markers: { size: 6 },
                            stroke: { curve: "smooth" }
                        }}
                    >
                        <Grid item xs={12}>
                            <SelectedChart />
                        </Grid>
                    </Bound>
                </Grid>
            </Bound>
        </>
    )

    function setSnackbar() {
        setMessage("Edited in selected chart window")
    }
}

export default OneBoundContextApp
