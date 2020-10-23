import cubejs from "@cubejs-client/core";
import moment from "moment";
import numeral from "numeral";
import React from "react";
import { Col, Container, Row } from "reactstrap";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Chart from "./Chart";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL,
});
const numberFormatter = (item) => numeral(item).format("0,0");
const percentFormatter = (item) => numeral(item / 100.0).format("0%");
const dateFormatter = (item) => moment(item).format("MMM DD");

const COLORS = [
  "#7DB3FF",
  "#49457B",
  "#FF7C78",
  "#FED3D0",
  "#6F76D9",
  "#9ADFB4",
  "#2E7987",
];

const renderSingleValue = (resultSet, key, postFix = "") => (
  <h1>
    {numberFormatter(resultSet.chartPivot()[0][key])}
    {postFix}
  </h1>
);

export default function App(props) {
  return (
    <Container fluid>
      <Row>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Requests"
            query={{ measures: ["Logs.count"] }}
            render={(resultSet) => renderSingleValue(resultSet, "Logs.count")}
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Errors"
            query={{ measures: ["Logs.errorCount"] }}
            render={(resultSet) =>
              renderSingleValue(resultSet, "Logs.errorCount")
            }
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Error Rate"
            query={{
              measures: ["Logs.errorRate"],
            }}
            render={(resultSet) =>
              renderSingleValue(resultSet, "Logs.errorRate", "%")
            }
          />
        </Col>
      </Row>
      <Row>
        <Col sm="6">
          <Chart
            cubejsApi={cubejsApi}
            title="Error Rate By Day"
            query={{
              measures: ["Logs.errorRate"],
              timeDimensions: [
                {
                  dimension: "Logs.createdAt",
                  dateRange: ["2019-04-01", "2019-04-09"],
                  granularity: "day",
                },
              ],
            }}
            render={(resultSet) => (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resultSet.chartPivot()}>
                  <CartesianGrid strokeDasharray="5 5" />
                  <XAxis dataKey="x" tickFormatter={dateFormatter} />
                  <YAxis
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tickFormatter={percentFormatter}
                  />
                  <Tooltip labelFormatter={dateFormatter} />
                  <Line
                    type="monotone"
                    dataKey="Logs.errorRate"
                    name="Error Rate"
                    stroke="rgb(106, 110, 229)"
                    fill="rgba(106, 110, 229, .16)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          />
        </Col>
        <Col sm="6">
          <Chart
            cubejsApi={cubejsApi}
            title="Errors by Status"
            query={{
              measures: ["Logs.count"],
              dimensions: ["Logs.status"],
              filters: [
                {
                  dimension: `Logs.isError`,
                  operator: `equals`,
                  values: ["Yes"],
                },
              ],
            }}
            render={(resultSet) => {
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      label
                      nameKey="x"
                      dataKey="Logs.count"
                      data={resultSet.chartPivot()}
                    >
                      {resultSet.chartPivot().map((entry, index) => (
                        <Cell fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              );
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
