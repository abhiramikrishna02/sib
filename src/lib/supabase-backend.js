import { isSupabaseConfigured, isSupabaseFetchError, supabase } from './supabase.js'

const SUPPORTED_TABLES = new Set(['universities', 'colleges', 'courses'])

function getApiBase() {
  return '/api/supabase'
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, String(value))
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

async function parseApiResponse(response) {
  const text = await response.text()
  let payload = {}

  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { error: text }
    }
  }

  if (!response.ok) {
    const error = new Error(payload?.error || payload?.message || `Request failed with status ${response.status}`)
    error.details = payload?.details || payload?.message || text
    error.status = response.status
    throw error
  }

  return payload
}

async function requestApi(method, tableName, { payload, id } = {}) {
  const response = await fetch(`${getApiBase()}${buildQueryString({ table: tableName, id })}`, {
    method,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify({ payload }),
  })

  return parseApiResponse(response)
}

async function directRead(tableName) {
  const ordered = await supabase.from(tableName).select('*').order('created_at', { ascending: false })
  if (!ordered.error) return ordered

  const message = `${ordered.error.message || ''} ${ordered.error.details || ''} ${ordered.error.hint || ''}`.toLowerCase()
  const canRetryWithoutOrder =
    message.includes('created_at') ||
    message.includes('order') ||
    message.includes('does not exist') ||
    message.includes('schema cache')

  if (canRetryWithoutOrder) {
    const unordered = await supabase.from(tableName).select('*')
    if (!unordered.error) return unordered
  }

  return ordered
}

function shouldUseApiFallback(error) {
  return isSupabaseFetchError(error) || error?.name === 'TypeError'
}

export async function loadTableRows(tableName) {
  if (!SUPPORTED_TABLES.has(tableName)) {
    throw new Error(`Unsupported table: ${tableName}`)
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const result = await directRead(tableName)
      if (!result.error || !shouldUseApiFallback(result.error)) {
        return result
      }
    } catch (error) {
      if (!shouldUseApiFallback(error)) throw error
    }
  }

  return requestApi('GET', tableName)
}

export async function saveTableRow(tableName, { payload, id, mode = 'insert' }) {
  if (!SUPPORTED_TABLES.has(tableName)) {
    throw new Error(`Unsupported table: ${tableName}`)
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const query =
        mode === 'update'
          ? supabase.from(tableName).update(payload).eq('id', id).select()
          : supabase.from(tableName).insert([payload]).select()

      if (!query.error || !shouldUseApiFallback(query.error)) {
        return query
      }
    } catch (error) {
      if (!shouldUseApiFallback(error)) throw error
    }
  }

  return requestApi(mode === 'update' ? 'PATCH' : 'POST', tableName, { payload, id })
}

export async function deleteTableRow(tableName, id) {
  if (!SUPPORTED_TABLES.has(tableName)) {
    throw new Error(`Unsupported table: ${tableName}`)
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const result = await supabase.from(tableName).delete().eq('id', id)
      if (!result.error || !shouldUseApiFallback(result.error)) {
        return result
      }
    } catch (error) {
      if (!shouldUseApiFallback(error)) throw error
    }
  }

  return requestApi('DELETE', tableName, { id })
}
