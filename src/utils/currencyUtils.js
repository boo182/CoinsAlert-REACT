export const currencyDisplay = (currency) => {
    if (currency === "eur") {
      return '€';
    } else if (currency === 'usd') {
      return '$';
    } else if (currency === 'btc') {
      return '₿'
    }
  };