import React from "react";
import { useBoundValue } from "./bound-value";
import { ChartComponent } from "./ChartComponent";

export function SelectedChart() {
    const [chartToUse] = useBoundValue("selectedChart", "chart1");
    return <ChartComponent chart={chartToUse} />;
}
