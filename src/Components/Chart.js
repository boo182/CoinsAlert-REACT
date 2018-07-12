import React, { Component } from 'react'
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card, Button, Menu, Dropdown  } from 'antd';
import moment from 'moment';

export default class Chart extends Component {
    state = {
        history: [],
        datas: [],
        domain: [],
    }
    componentWillMount(){
        fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${this.props.crypto}&tsym=${this.props.currency}&limit=60&aggregate=3&e=CCCAGG`)
        .then(res => res.json())
        .then(res => this.setState({history: res.Data}, () => {
            this.generateData();
        }))
        .catch(err => console.log(err));
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.crypto !== this.props.crypto) {
            fetch(`https://min-api.cryptocompare.com/data/histohour?fsym=${nextProps.crypto}&tsym=${nextProps.currency}&limit=60&aggregate=3&e=CCCAGG`)
            .then(res => res.json())
            .then(res => this.setState({history: res.Data}, () => {
                this.generateData();
            }))
            .catch(err => console.log(err));
        }
    }

    getDomain = (datas) => {
      const alertsNumber = datas.map(item => item.value);
      this.setState({domain: [Math.min(...alertsNumber), Math.max(...alertsNumber)]});
    }

    generateData = () => {
        const { history, loading } = this.state;

        const data = history.map(item => {
            return {
                name: moment(item.time).format('hh:mm'),
                value: item.open,
            }
        });
        this.setState({ datas: data });
        this.getDomain(data);
    }

    menuItems = () => {
        return (
            <Menu onClick={() => console.log('sqdfsd')}>
                <Menu.Item key="1">1st menu item</Menu.Item>
                <Menu.Item key="2">2nd menu item</Menu.Item>
                <Menu.Item key="3">3rd item</Menu.Item>
            </Menu>
        );
    }

    render() {
    
    return (
        <Card
            title={`Evolution of ${this.props.crypto} in the last hour`}
            bordered
            style={{ width: '80vw' }}
            extra={
                <div>
                  <Dropdown.Button 
                    onClick={() => console.log('slkdfj')}
                    overlay={this.menu}
                  >
                    TimeShift
                  </Dropdown.Button>
                    <Button 
                        type="danger"
                        onClick={this.props.closeChart}
                    >
                    X
                    </Button>
                </div>
              }
            >
            {<LineChart width={1400} height={400} data={this.state.datas}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis type="number" domain={this.state.domain} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>}
      </Card>
    )
  }
}