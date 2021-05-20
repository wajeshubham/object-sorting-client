/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Bar,
  Cell,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles({
  lastAddedCard: {
    minWidth: 275,
    background: "hsl(134deg 61% 41% / 13%)",
    textAlign: "start",
  },
  boxCountCard: {
    minWidth: 275,
    background: "rgba(108,117,125,.06274509803921569)",
    textAlign: "start",
  },
  pos: {
    marginBottom: 12,
  },
});

const App = () => {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [int, setInt] = useState(undefined);
  const [lastAdded, setLastAdded] = useState(undefined);

  useEffect(() => {
    const ws = new WebSocket("wss://object-sorting-server.herokuapp.com/ws");
    ws.onmessage = onMessage;
    setInt(setInterval(() => ws.send("echo"), 1000));
    return () => {
      ws.close();
      clearInterval(int);
    };
  }, []);

  const onMessage = (ev) => {
    const recv = JSON.parse(ev.data);
    setLastAdded(recv.last_added);
    setData(recv.value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      console.log(payload, "pp");
      return (
        <div className="custom-tooltip">
          <span className="label">{`type : ${label}`}</span>
          <br />
          <span className="count">{`count : ${payload[0].value}`}</span>
          <br />
          <span className="count">{`color : ${payload[0].payload.color}`}</span>
          <br />
          <span className="count">{`shape : ${payload[0].payload.shape}`}</span>
          <br />
        </div>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3} style={{ textAlign: "center" }}>
      <Grid item xs={6}>
        <h2>Live Count</h2>

        <ComposedChart
          width={700}
          height={500}
          data={data}
          style={{
            height: "500px",
          }}
          barSize={20}
        >
          <XAxis
            dataKey="box_type"
            label={{
              value: "Products type",
              angle: 0,
              position: "indideBottom",
            }}
            height={80}
            stroke="#fff"
          />

          <YAxis
            label={{
              value: "Products count",
              angle: -90,
              position: "insideLeft",
            }}
            type={"number"}
            domain={[0, 100]}
            tickCount={25}
            stroke="#fff"
          />

          <Tooltip content={<CustomTooltip />} />
          <CartesianGrid stroke="#fff" strokeDasharray="5 5" />
          <Bar dataKey="count" fill="#161625" background={{ fill: "#22223a" }}>
            {data.map((entry) => {
              const color = entry.color;
              return <Cell fill={color} />;
            })}
          </Bar>
          <Line type="monotone" dataKey="count" stroke="#ff7300" />
        </ComposedChart>
      </Grid>
      <Grid item xs={6} id={"cards-row"}>
        <h2>Meta Information</h2>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Card className={classes.lastAddedCard}>
              <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                <h2
                  style={{
                    color: "#28a745",
                  }}
                >
                  Current Product
                </h2>
                {lastAdded !== undefined ? (
                  <Typography variant="body2" component="p">
                    <p
                      style={{
                        color: "#28a745",
                      }}
                    >
                      Product type: {lastAdded.type}
                    </p>
                    <p
                      style={{
                        color: "#28a745",
                      }}
                    >
                      Product color: {lastAdded.color}
                    </p>
                    <p
                      style={{
                        color: "#28a745",
                      }}
                    >
                      Product shape: {lastAdded.shape}
                    </p>
                    <p
                      style={{
                        color: "#28a745",
                      }}
                    >
                      Product count: {lastAdded.count}
                    </p>
                    <p
                      style={{
                        color: "#28a745",
                      }}
                    >
                      Product box: {lastAdded.box_type}
                    </p>
                  </Typography>
                ) : (
                  <Typography variant="body2" component="p">
                    <p
                      style={{
                        color: "#28a745",
                      }}
                    >
                      Loading product details...
                    </p>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default App;
