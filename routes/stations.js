'use strict'

const mfb = require('meinfernbus')
const search = require('search-meinfernbus-locations')

let readStations = mfb.stations()
let stations = null

readStations
.then(r => {
	readStations = null
	stations = r
})
.catch(err => {
	console.error(err)
	process.exit(1)
})

const error = (msg, code) => {
	const e = new Error(msg)
	e.statusCode = code
	return e
}

const some = (req, res, next) => {
	if ('string' !== typeof req.query.query || req.query.query.length === 0)
		return next(error('missing query parameter.', 400))
	const results = search(req.query.query).filter(l => l.type === 'station')
	res.json(results)
	next()
}

const all = async (req, res, next) => {
	const data = readStations ? await readStations : stations
	res.json(data)
    next()
}

module.exports = {all, some}
