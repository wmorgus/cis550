import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {Button} from 'react-bootstrap';

class LineGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          dataLine: {},
        };
    }
    componentWillMount(){
           var dataLine = {
              labels: ["01/17", "02/17", "03/17", "04/17", "05/17", "06/17", "07/17", "08/17", "09/17", "10/17", "11/17", "12/17",
              "01/18", "02/18", "03/18", "04/18", "05/18", "06/18", "07/18", "08/18", "09/18", "10/18", "11/18", "12/18"],
              datasets: [
                {
                  label: "Acoustics",
                  fill: true,
                  lineTension: 0.5,
                  backgroundColor: "rgba(180, 204,230, .3)",
                  borderColor: "rgb(205, 130, 158)",
                  borderCapStyle: "butt",
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: "miter",
                  pointBorderColor: "rgb(205, 130,1 58)",
                  pointBackgroundColor: "rgb(255, 255, 255)",
                  pointBorderWidth: 10,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgb(0, 0, 0)",
                  pointHoverBorderColor: "rgba(220, 220, 220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: []
                },
                {
                  label: "Danceability",
                  fill: true,
                  lineTension: 0.3,
                  backgroundColor: "rgba(184, 170, 210, .3)",
                  borderColor: "rgb(35, 26, 136)",
                  borderCapStyle: "butt",
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: "miter",
                  pointBorderColor: "rgb(35, 26, 136)",
                  pointBackgroundColor: "rgb(255, 255, 255)",
                  pointBorderWidth: 10,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgb(0, 0, 0)",
                  pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: []
                },
                {
                    label: "Energy",
                    fill: true,
                    lineTension: 0.5,
                    backgroundColor: "rgba(100, 204, 230, .3)",
                    borderColor: "rgb(1, 204, 230)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(205, 130,1 58)",
                    pointBackgroundColor: "rgb(100, 250, 100)",
                    pointBorderWidth: 10,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgb(0, 0, 0)",
                    pointHoverBorderColor: "rgba(220, 220, 220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                  }
              ]
          };

        var acc = [];
        var dan = [];
        var eng = [];

        fetch("http://localhost:8081/acoustics/", {
            method: 'GET' // The type of HTTP request.
        }).then(response => response.json()).then((data) => {
          console.log(data.rows)
          var result = data.rows;
          result.forEach(function(item,index,arr) {
            acc.push(item[0]);
            dan.push(item[1]);
            eng.push(item[2]);
          });
         dataLine.datasets[0].data = acc; 
         dataLine.datasets[1].data = dan; 
         dataLine.datasets[2].data = eng; 
         this.setState({
            dataLine: dataLine
          });
        });
      }

  

  render() {
    document.body.style = 'background: #bdeaef;';
    return (
        
      <MDBContainer>
          <form>
              <Button variant="btn btn-success" href="http://localhost:3000/time" style={{backgroundColor: '#08a1b3', borderColor: '#08a1b3',}}>Back</Button>
        </form>
        <h3 className="mt-5">Line chart</h3>
        <Line data={this.state.dataLine} options={{ responsive: true }} />
      </MDBContainer>
    );
  }
}

export default LineGraph;