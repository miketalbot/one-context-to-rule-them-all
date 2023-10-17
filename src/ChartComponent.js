import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Bound } from "./bound";
import { useBoundValue } from "./bound-value";
import { ChartDisplay } from "./ChartDisplay";
import { DataEditor } from "./DataEditor";

export function ChartComponent({ chart }) {
    const [chartState] = useBoundValue(chart, {});
    const theme = useTheme();
    const [selectedChart, setSelectedChart] = useBoundValue(
        "selectedChart",
        "chart1"
    );
    return (
        <Box
            onClick={() => setSelectedChart(chart)}
            sx={{
                cursor: "pointer",
                outline: chart === selectedChart
                    ? "3px solid " + theme.palette.primary.main
                    : "",
                p: 1,
                borderRadius: 1
            }}
        >
            <Bound target={chartState}>
                <Stack spacing={2}>
                    <Typography variant="subtitle2" component="div">
                        Chart: "{chart}"
                    </Typography>
                    <DataEditor />
                    <ChartDisplay />
                </Stack>
            </Bound>
        </Box>
    );
}
