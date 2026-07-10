import { createClient } from '@supabase/supabase-js'

function readEnvValue(...keys) {
  for (const key of keys) {
    const value = process.env[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

const supabaseUrl = readEnvValue('SUPABASE_URL', 'VITE_SUPABASE_URL')
const supabaseKey = readEnvValue(
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_ANON_KEY',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_ANON_KEY'
)

function createJsonResponse(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function isSupportedTable(table) {
  return table === 'universities' || table === 'colleges' || table === 'courses'
}

function getClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase runtime config is missing on Vercel. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or VITE_ equivalents) in Project Settings.')
  }

  return createClient(supabaseUrl, supabaseKey)
}

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'object') return req.body

  try {
    return JSON.parse(req.body)
  } catch {
    return {}
  }
}

function normalizePayload(payload) {
  return payload && typeof payload === 'object' ? payload : {}
}

export default async function handler(req, res) {
  try {
    const { table, id } = req.query || {}
    if (!isSupportedTable(table)) {
      createJsonResponse(res, 400, { error: `Unsupported table: ${table}` })
      return
    }

    const supabase = getClient()

    if (req.method === 'GET') {
      const ordered = await supabase.from(table).select('*').order('created_at', { ascending: false })
      if (!ordered.error) {
        createJsonResponse(res, 200, { data: ordered.data || [] })
        return
      }

      const unordered = await supabase.from(table).select('*')
      if (!unordered.error) {
        createJsonResponse(res, 200, { data: unordered.data || [] })
        return
      }

      createJsonResponse(res, 500, {
        error: unordered.error.message || ordered.error.message || 'Failed to load data.',
        details: unordered.error.details || ordered.error.details || '',
      })
      return
    }

    const body = parseBody(req)
    const payload = normalizePayload(body.payload)

    if (req.method === 'POST') {
      const result = await supabase.from(table).insert([payload]).select()
      if (result.error) {
        createJsonResponse(res, 500, {
          error: result.error.message || 'Failed to insert row.',
          details: result.error.details || '',
          hint: result.error.hint || '',
        })
        return
      }

      createJsonResponse(res, 200, { data: result.data || [] })
      return
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const rowId = id || body.id
      if (!rowId) {
        createJsonResponse(res, 400, { error: 'Missing row id for update.' })
        return
      }

      const result = await supabase.from(table).update(payload).eq('id', rowId).select()
      if (result.error) {
        createJsonResponse(res, 500, {
          error: result.error.message || 'Failed to update row.',
          details: result.error.details || '',
          hint: result.error.hint || '',
        })
        return
      }

      createJsonResponse(res, 200, { data: result.data || [] })
      return
    }

    if (req.method === 'DELETE') {
      const rowId = id || body.id
      if (!rowId) {
        createJsonResponse(res, 400, { error: 'Missing row id for delete.' })
        return
      }

      const result = await supabase.from(table).delete().eq('id', rowId)
      if (result.error) {
        createJsonResponse(res, 500, {
          error: result.error.message || 'Failed to delete row.',
          details: result.error.details || '',
          hint: result.error.hint || '',
        })
        return
      }

      createJsonResponse(res, 200, { data: [] })
      return
    }

    createJsonResponse(res, 405, { error: `Method ${req.method} not allowed.` })
  } catch (error) {
    createJsonResponse(res, 500, {
      error: error?.message || 'Unexpected server error.',
      details: error?.details || '',
      hint: error?.hint || '',
    })
  }
}
