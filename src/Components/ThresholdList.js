import React, { Component } from 'react'
import AlertsDisplayer from './AlertsDisplayer';
import { List, Button, Badge, Icon } from 'antd';

export default class ThresholdList extends Component {
  state = {
    displayAlerts: false,
    thresholdId: 0,
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.alerts.length > 0 && this.state.thresholdId !== 0) {
      this.setState({ displayAlerts: true });
    } else {
      this.setState({ displayAlerts: false });
      
    }
  }
  componentWillUpdate(nextProps) {
    if(nextProps.update !== this.props.update) {
      this.props.fetch(`${URL}/threshold`, 'thresholds');
    }
  }

  currencyDisplay = currency => {
    if (currency === "eur") {
      return '€';
    } else if (currency === 'usd') {
      return '$';
    } else if (currency === 'btc') {
      return '₿'
    }
  };

  createBadge = (id) => {
    const res = this.props.hits.filter(hit => hit.alertId === id);
    const resp = res[0];
    return resp && resp.alerts;
  };

  displayAlerts = (id, index) => (e) => {
    e.preventDefault();
    this.setState({ thresholdId: index });
    this.props.getAlertsByThresholds(id);

  }
  generateData = () => {
    const { thresholds } = this.props;
    return thresholds.map((item, index) => {

      return {
          id: item.id,
          description: (
          <div style={{display: 'flex', marginLeft: '20px', justifyContent: 'space-between'}}>
            <div style={{display: 'flex'}} >
              <h3>n°{item.id}</h3>
              <div style={{marginLeft: '20px' }}>
                <span style={{ fontWeight: 600 }}>{item.threshold} {this.currencyDisplay(item.currency)} </span>
                on <span style={{ fontWeight: 600 }}>{item.crypto}</span>
              </div>
            </div>
            {thresholds &&
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div onClick={this.displayAlerts(item.id, index)} style={{ cursor: 'pointer' }}>
                  <Badge count={this.createBadge(item.id)}/>
                </div>
              </div>
            }
            <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button
                type={item.emailNotification ? 'primary' : 'default' }
                size={'small'}
                onClick={this.props.mailNotification(item.id, !item.emailNotification)}
              >
                <Icon type="mail" />
              </Button>
              <Button
                style={{ marginRight: '20px', marginLeft: '20px' }} 
                type="danger" 
                size={'small'}
                onClick={() => {
                  this.setState({ displayAlerts: false, thresholdId: 0 });
                  this.props.onDelete(item.id)
                }}>
              X
              </Button>
            </div>
          </div>)
        };
    })
  }

  closeAlertsCard = () => (e) => {
    e.preventDefault();
    this.setState({ displayAlerts: false, thresholdId: 0 });
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{
          margin: '50px 0px 0px 20px',
          width: '40vw',
          maxHeight: '50vh', 
          overflowY: 'auto'
        }}>
          <List
            itemLayout="horizontal"
            bordered
            dataSource={this.generateData()}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                    description={<div style={{ whiteSpace: 'pre-wrap' }}>{item.description}</div>}
                />
              </List.Item>
            )}
          />
        </div>
        {
          this.state.displayAlerts &&
          <AlertsDisplayer
            style={{ margiTop: 50 }}
            threshold={this.props.thresholds[this.state.thresholdId]}
            alerts={this.props.alerts}
            onEmptyAlerts={this.props.onEmptyAlerts}
            closeAlertsCard={this.closeAlertsCard}
            />
        }
      </div>
    )
  }
}
