import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Card from "../../components/UIElements/Card";
import "./AttendenceItem.css";
const AttendenceItem = (props) => {
  const [chartData, setChartData] = useState({});

  const labels = [];
  const data = [];
  props.attendence.subjects.forEach((s) => {
    labels.push(s.subName);
    data.push(s.present);
  });
  useEffect(() => {
    const setting = () => {
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Attendence",
            data: data,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 4,
          },
        ],
      });
    };
    setting();
  }, []);
  if (props.attendence.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>Not any attendence updated yet</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Card className="chart center">
        <Bar
          data={chartData}
          options={{
            maintainAspectRatio: false,
            title: { display: true, text: "Attendence", fontSize: 25 },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }}
        />
      </Card>
    </React.Fragment>
  );
};
export default AttendenceItem;
