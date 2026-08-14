"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

import { useEffect, useState } from "react";
import API from "@/api";

type Props = {
    refreshKey: number;
    setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Last30DaysChart({
    refreshKey,
    setRefreshing,
}: Props) {

    type ChartData = {
        day: string;
        work: number;
        break: number;
    };
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchChart = async () => {
            try {
                const { data } = await API.get(
                    "/sessions/last-30-days-chart"
                );

                setData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setRefreshing(false);
            }
        };

        fetchChart();
    }, [refreshKey, setRefreshing]);

    const formatYAxis = (value: number) => {
        const h = Math.floor(value);
        const m = Math.round((value - h) * 60);

        return `${h}h ${m}m`;
    }

    const maxHours = Math.max(
        ...data.map((d) => d.work + d.break),
        1
    );

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid
                    stroke="#24344F"
                    strokeDasharray="0"
                    vertical={false}
                />
                <XAxis
                    dataKey="day"
                    interval={2}
                    tick={{ fill: "#8B95A7", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    domain={[0, Math.ceil(maxHours)]}
                    tickFormatter={formatYAxis}
                    tick={{ fill: "#8B95A7", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                />

                <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={<CustomTooltip />} />
                <Bar
                    dataKey="work"
                    stackId="time"
                    fill="#4EA1FF"
                    radius={[0, 0, 0, 0]}
                    barSize={11}
                />

                <Bar
                    dataKey="break"
                    stackId="time"
                    fill="#F59E0B"
                    radius={[3, 3, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}