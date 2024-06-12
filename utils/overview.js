async function getUserBalance () {
  return 100;
}

async function getRecentTransactions () {
  return [{
    date: '2/18/15 00:49',
    to: 'Marcus',
    amount: '-3.3496129 BTC'
  }, {
    date: '2/13/15 10:08',
    to: 'Paul',
    amount: '+1.3496129 BTC'
  }, {
    date: '2/16/15 05:58',
    to: 'Amenda',
    amount: '-0.230000 BTC'
  }];
}

module.exports = { getUserBalance, getRecentTransactions };
