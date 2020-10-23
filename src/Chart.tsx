import React from "react";
import { Card, CardTitle, CardBody, CardText, Spinner } from "reactstrap";
import { QueryRenderer } from "@cubejs-client/react";

const Chart = ({ cubejsApi, title, query, render }) => (
  <Card>
    <CardBody>
      <CardTitle tag="h5">{title}</CardTitle>
      <CardText>
        <QueryRenderer
          query={{
            timeDimensions: [
              {
                dimension: `Logs.createdAt`,
                dateRange: ["2019-04-01", "2019-04-09"],
              },
            ],
            ...query,
          }}
          cubejsApi={cubejsApi}
          render={({ resultSet }) => {
            if (!resultSet) {
              return <Spinner style={{ width: "2rem", height: "2rem" }} />;
            }

            return render(resultSet);
          }}
        />
      </CardText>
    </CardBody>
  </Card>
);

export default Chart;
