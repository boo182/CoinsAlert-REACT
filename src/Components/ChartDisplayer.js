import React, { Component } from 'react'
import {Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend} from 'recharts';
import moment from 'moment';

export default class ChartDisplayer extends Component {
    getDomain = () => {
      const { alerts } = this.props;
      const alertsNumber = alerts.map(item => Number(item.alertedAt));
      return [0, Math.max(...alertsNumber)];
    }
    render() {
      const { alerts } = this.props;
      const data = alerts.length > 0
      ? alerts.map(item => {
          return {
              name: moment(item.createdAt).format('DD/MM'),
              alertedAt: item.alertedAt,
              amt: this.props.threshold.threshold,
          }
      })
      : [];

    return (
      <div>
        {data.length > 0 && <LineChart width={400} height={200} data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={this.getDomain()} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="alertedAt" stroke="#8884d8" />
        </LineChart>}
      </div>
    )
  }
}
