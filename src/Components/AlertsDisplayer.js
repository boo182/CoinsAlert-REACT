import React, { Component } from 'react'
import ChartDisplayer from './ChartDisplayer';
import { currencyDisplay } from '../utils/currencyUtils';
import { Card, Button, Icon } from 'antd';
import moment from 'moment'

export default class AlertDisplayer extends Component {
  state = {
    showGraph: false,
  }

  generateAlerts = () => {
      const { alerts, threshold } = this.props;
      return alerts.map(item => {
        const duration = moment(item.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
        return (
          <div
            key={item.id}
            style={{ borderBottom: '1px solid lightgrey', padding: '10px 0px 10px 0px' }}
          >
            <div
              style={{ fontWeight: 600 }}
            >
              {threshold.crypto} has reached {item.alertedAt} {currencyDisplay(threshold.currency)}
            </div>
            <div>({duration})</div>
          </div>);
      }
    )
  }

  generateTitle = () => {
      const { threshold } = this.props;
      return `Threshold at ${threshold.threshold} ${currencyDisplay(threshold.currency)} on ${threshold.crypto}`
  }

  render() {
    this.generateTitle();
    return (
      <div>
        <Card
          title={this.generateTitle()}
          extra={
            <div>
              <a onClick={this.props.onEmptyAlerts(this.props.threshold.id)}
                style={{ marginRight: '10px' }}>Empty</a>
              <Button
                type="danger"
                size="small"
                onClick={this.props.closeAlertsCard()}
                >
                x
              </Button>
              <Button
                size="small"
                style={{ marginLeft: 10}}
                onClick={() => this.setState({ showGraph: !this.state.showGraph })} 
              >
                <Icon type={this.state.showGraph ? "bars" : "area-chart"} />
              </Button> 
            </div>
          }
          style={{ width: 400, maxHeight: '30vh', overflow: 'auto' }}
        >
          {this.state.showGraph
          ?  <ChartDisplayer
              style={{ margiTop: 50 }}
              threshold={this.props.threshold}
              alerts={this.props.alerts}
            />
          : this.generateAlerts()
        }
        </Card>
      </div>
    )
  }
}
