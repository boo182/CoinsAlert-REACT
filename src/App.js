import React, { Component } from 'react';
import Input from './Components/Input';
import ThresholdList from './Components/ThresholdList';
import Chart from './Components/Chart';
import CryptoList from './Components/CryptoList';
import { Table, Button, Icon } from 'antd';
import 'antd/dist/antd.css';
import * as Rx from 'rxjs';

class App extends Component {
  state = {
    loading: false,
    crypto: null,
    coins: null,
    columns: [{
      title: 'Crypto',
      dataIndex: 'crypto',
      key: 'crypto',
    }, {
      title: 'EUR',
      dataIndex: 'eur',
      key: 'eur',
    }, {
      title: 'USD',
      dataIndex: 'usd',
      key: 'usd',
    }, {
      title: 'BTC',
      dataIndex: 'btc',
      key: 'btc',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            type="danger"
            onClick={this.removeCrypto(text, record)}
          >
          Remove
          </Button>
          <Button
            style={{ marginLeft: 20 }}
            onClick={() => {
              this.setState({ chartCrypto: text.crypto }, () => {
                this.setState({ displayChart: true });
              })
            }}
          >
          <Icon type="area-chart" />
          </Button>
        </span>
      ),
    },
  ],
    thresholds: [],
    alerts: [],
    minValue: 0,
    alertsByThresholds: [],
    chartCrypto: '',
    displayChart: false,
  }

  componentWillMount() {
    this.fetcher('/coins', 'coins');
    this.coinAlert();
    this.fetcher('/alert', 'alerts');
    this.fetcher('/threshold', 'thresholds');
    this.coinFetcher = Rx.interval(120000)
      .subscribe(() => {
        this.fetcher('/coins', 'coins');
        this.coinAlert();
      });
  }

  componentWillUnmount() {
    this.coinFetcher.unsuscribe();
  }

  onDelete = (id) => {
    this.setState({ loading: true });    
    fetch(`/threshold/${id}`, { method: 'DELETE'})
    .then(res => res.json())
    .then(res => this.setState({ loading: false }))
    .catch(err => console.log(err));
  }

  removeCrypto = (text, record) => (e) => {
    this.setState({ loading: true });
    fetch(`/coins/${text.crypto}`, { 
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => this.setState({ loading: false, crypto: null }))
    .catch(err => console.log(err));
    this.fetcher('/coins', 'coins');
  }

  onMailEnabled = (id, isEnabled) => e => {
    e.preventDefault();
    this.setState({ loading: true });
    fetch(`/threshold`, { 
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        isEnabled,
      }),
    })
    .then(res => res.json())
    .then(res => this.setState({ loading: false }))
    .catch(err => console.log(err));

  }
  getAlertsByThresholds = (id) => {
    this.fetcher(`/alert/${id}`, 'alertsByThresholds');
  }

  addToTable = newCrypto => {
    this.setState({ loading: true });
    fetch(`/coins/add`, { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newCrypto
      }),
    })
    .then(res => res.json())
    .then(res => this.setState({ loading: false }))
    .catch(err => console.log(err));
    this.fetcher('/coins', 'coins');    
  }

  fetcher = (url, state) => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
        [state]: res
      })
    });
  }

  createDataSource = () => {
    const { coins } = this.state;
    let dataSource = []; 
    for(let coin in coins ) {
      dataSource.push({
        key: coin,
        crypto: coin,
        btc: coins[coin].BTC,
        usd: coins[coin].USD,
        eur: coins[coin].EUR,
      });
    }
    return dataSource;
  }

  coinAlert = () => {
   const { thresholds, coins } = this.state;
   thresholds.forEach(item => {
     const res = coins && coins[item.crypto][item.currency.toUpperCase()];
     if(item.threshold < res) {
       this.alert(item.id, res);
     }
   })
  }

  alert = (id, alertedAt) => {
    this.setState({ loading: true });
    fetch('/alert', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id,
        alertedAt
      }),
    })
    .then(res => res.json())
    .then(res => this.setState({ loading: false, alerts: res }))
    .catch(err => console.log(err));
  }

  getAlerts = () => {
    this.fetcher('/alert', 'alerts');
  }

  setThreshold = (values) => {
    this.setState({ loading: true });
    fetch('/threshold', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currency: values.currency,
        threshold: values.threshold,
        crypto: this.state.crypto,
      }),
    })
    .then(res => res.json())
    .then(res => this.setState({ loading: false, crypto: null }))
    .catch(err => console.log(err));
  }

  onEmptyAlerts = (id) => e => {
    e.preventDefault();
    this.setState({ loading: true });
    fetch(`/alert/${id}`, { method: 'DELETE'})
    .then(res => res.json())
    .then(res => this.setState({ loading: false }))
    .catch(err => console.log(err));
    this.getAlertsByThresholds(id);
    this.getAlerts();
  }

  render() {
    const dataSource = this.createDataSource();
    const { coins, crypto } = this.state;
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3vh' }}>
          <div>
            <Table
              style={{ cursor: 'pointer', width: '80vw'}}
              bordered
              dataSource={dataSource}
              columns={this.state.columns}
              onRow={(record) => ({onClick: () => {
                  this.setState({ crypto: record.crypto });
                }
              })}
              />
              {this.state.displayChart && <div>
                <Chart
                  crypto={this.state.crypto}
                  currency={'EUR'}
                  closeChart={() => this.setState({ displayChart: false })}
                />
              </div>}
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <CryptoList
                  coins={this.state.coins}
                  addToTable={this.addToTable}
                  loading={this.state.loading}
                />
            </div>
            <div>
              <Input
                setThreshold={this.setThreshold}
                chosenCrypto={this.state.crypto}
                coin={crypto && coins[crypto]}
              />
              <ThresholdList
                thresholds={this.state.thresholds}
                fetch={this.fetcher}
                update={this.state.loading}
                onDelete={this.onDelete}
                hits={this.state.alerts}
                mailNotification={this.onMailEnabled}
                alerts={this.state.alertsByThresholds}
                getAlertsByThresholds={this.getAlertsByThresholds}
                onEmptyAlerts={this.onEmptyAlerts}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
