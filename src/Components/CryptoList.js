import React, { Component } from 'react'
import { Select } from 'antd';



export default class CryptoList extends Component {

  componentWillUPdate(nextProps) {
    return nextProps.loading !== this.props.loading;
  }

  generateOptions = () => {
    const { coins } = this.props;
    const Option = Select.Option;
    const cryptos =  ['BTC', 'ETH', 'XRP', 'BCH', 'EOS', 'LTC', 'ADA', 'XLM', 'MIOTA', 'TRX', 'NEO'];

    const res = cryptos.filter(item => {
      let isInTable = false;
      for(let coin in coins) {
        if(coin === item) isInTable = true;
      }
      return !isInTable;
    });
    return res.map(item => <Option key={item}>{item}</Option>);
  }

  handleChange = (value) => {
    this.props.addToTable(value);
  }

  render() {

    return (
      <div>
        <Select
          size={'default'}
          placeholder={'Add Crypto to table'}
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {this.generateOptions()}
        </Select>
      </div>
    )
  }
}
