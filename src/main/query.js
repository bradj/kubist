'use strict'

const KubernetesStream = require('kubernetes-stream')

const { openObjectStream, closeStream } = require('./stream')

const PouchDB = require('./db')
const Queries = new PouchDB('queries')

const router = require('express').Router()
const debug = require('debug')('kubist:query')

const watching = {}

router.get('/watch', (req, res) => {
  return res.json({ watching: Object.keys(watching) })
})

router.post('/watch/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    const query = await Queries.get(id)

    if (watching[id]) return res.json({ watching: true })
    watching[id] = true

    const { resource, namespace } = query
    const stream = new KubernetesStream({
      labelSelector: query.selector,
      resource,
      namespace
    })

    debug('created stream for query', query)
    await openObjectStream(id, stream)

    res.json({ watching: true })
  } catch (err) {
    next(err)
  }
})

router.delete('/watch/:id', async (req, res, next) => {
  const id = req.params.id

  if (!watching[id]) return res.json({ watching: false })
  delete watching[id]

  try {
    await closeStream(id)
    res.json({ watching: false })
  } catch (err) {
    next(err)
  }
})

module.exports = router