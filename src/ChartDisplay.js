import React from "react";
import { useBoundContext } from "./bound";
import Chart from "react-apexcharts";
import { useBoundValue } from "./bound-value";

export function ChartDisplay() {
    const {
        type = "bar", chartOptions = {}, chartHeight = 130
    } = useBoundContext();
    const [data] = useBoundValue("values", "");
    const chartData = data
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((v) => +v);

    return (
        <Chart
            height={chartHeight}
            type={type}
            options={{
                ...chartOptions,
                chart: {
                    toolbar: {
                        show: false
                    },
                    ...chartOptions.chart
                },
                xaxis: {
                    categories: chartData.map((d, i) => `${i + 1}`),
                    ...chartOptions.xaxis
                }
            }}
            series={[
                {
                    name: "Values",
                    data: chartData
                }
            ]} />
    );
}
