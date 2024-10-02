const CronJob = require('node-cron');
const BitqueryService = require('../services/BitqueryService')

const trackAccountsAndTrx = () => {
  const scheduledJobFunction = CronJob.schedule("*/10 * * * *", async () => {
    const result = await BitqueryService.getWhaleAccounts();
    console.log('cron-results', JSON.stringify(result))
  });

  scheduledJobFunction.start();
}



module.exports = {
  trackAccountsAndTrx
}