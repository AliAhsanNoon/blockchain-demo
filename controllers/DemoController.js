const { NotFoundError, ValidationError, BadRequestError } = require('../utils/errors')

const BitqueryService = require('../services/BitqueryService')

exports.getDemo = async (req, res) => {
    try {
        const response = await BitqueryService.getWhaleAccounts();
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error?.message)

    }
}
