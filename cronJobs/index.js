const AccountTrackingJob = require('./TrackAccountAndTrxJob');

const initScheduledJobs = () => {

    AccountTrackingJob.trackAccountsAndTrx()
}

module.exports = {
    initScheduledJobs
}