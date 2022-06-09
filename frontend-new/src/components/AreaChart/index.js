import React from "react";
import { Chart } from "react-google-charts";

export default function AreaChart(props) {
  const data = [
    ["createdAt", "value"]
  ];
  props.records.forEach(record => {
      const date = new Date(record.createdAt)
      data.push([`${date.getHours()}':'${date.getMinutes()}`,parseInt(record.value,10)])
  })
  const options = {
    title: props.title,
    hAxis: { title: "Time", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    chartArea: { width: "50%", height: "70%" },
  };
  return (<Chart
    chartType="AreaChart"
    width="100%"
    height="400px"
    data={data}
    options={options}
  />);
}
