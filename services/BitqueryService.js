const axios = require('axios');


exports.getWhaleAccounts = async () => {

    const accountsQuery = JSON.stringify({
        "query": `{
                EVM(dataset: realtime, network: bsc) {
                    BalanceUpdates(orderBy: {descendingByField: \"BalanceUpdate_AmountInUSD\"}\n     limit: {count: 10}\n    ) {
                         BalanceUpdate { 
                         Address
                         AmountInUSD
                         Amount
                         Id
                        }
                    }
                }
            }`,
        "variables": "{}"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://streaming.bitquery.io/graphql',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'BQYIAYLKivHW2aSg86jzeAtjGaDdHnjh',
            'Authorization': 'Bearer ory_at_Rju630DjAbV-P8YBFgAjVd27wG6HNcRFidrpXp3e3iM.udZPjijHDCfWovAERJEnppkakgEhXuxLnijs9s7z2dM'
        },
        data: accountsQuery
    };
    const response = await axios.request(config);
    const transactions = await getWhaleTransactions(response.data)
    return {
        whaleAccounts: response?.data || [],
        whaleTransactions: transactions || []
    }

}

const getWhaleTransactions = async (addressList) => {
    const addressLists = getAddressList(addressList);
    if (!addressList) throw new Error('Address not found!');

    const transactionQuery = JSON.stringify({
        "query": `query MyQuery {
            EVM(network: bsc) {
              Transfers {
                Transfer {
                  AmountInUSD
                  Sender(
                    if: {Transaction: {From: {in: ${addressLists}}}}
                  )
                  Receiver
                }
              }
            }
          }`,
        "variables": "{}"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://streaming.bitquery.io/graphql',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'BQYIAYLKivHW2aSg86jzeAtjGaDdHnjh',
            'Authorization': 'Bearer ory_at_Fenkv4FpOGp5lTMMb2BzGTYirsgPQJEL6cTv6uzJV1Y.csuHenWmxs4vruuFtFLIcTTeovq_-lrWnor4u4MUf90'
        },
        data: transactionQuery
    };

    const response = await axios.request(config)
    return response?.data ? response.data : []
}


const getAddressList = (params) => {
    const { data: { EVM: { BalanceUpdates } } } = params;
    const smartAddress = (BalanceUpdates.length > 0) ?
        BalanceUpdates
            .map(({ BalanceUpdate }) => BalanceUpdate.Address)
        : [];
    const addressListString = `["${smartAddress.join('","')}"]`;
    return addressListString;
}

const getBitQueryApiConfig = (query, isAccountInfo) => {

    const token = isAccountInfo ? process.env.BIT_QUERY_ACCOUNT_TOKEN : process.env.BIT_QUERY_TRANSACTION_TOKEN;

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://streaming.bitquery.io/graphql',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.BIT_QUERY_API_KEY,
            'Authorization': `Bearer ${token}`
        },
        data: query
    }

    return config;
}