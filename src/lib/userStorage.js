'use client'

const RESUME_KEY = 'jobpick_resumes'
const RECENT_KEY = 'jobpick_recent_jobs'
const BOOKMARK_KEY = 'jobpick_bookmarks'
const AUTH_KEY = 'jobpick_user'

function readJson(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function getCurrentUserScope() {
  if (typeof window === 'undefined') return 'guest'
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return 'guest'
    const user = JSON.parse(raw)
    return user?.email ? String(user.email).toLowerCase() : 'guest'
  } catch {
    return 'guest'
  }
}

function scopedKey(baseKey) {
  const scope = getCurrentUserScope()
  return `${baseKey}:${scope}`
}

export function getResumes() {
  return readJson(scopedKey(RESUME_KEY), [])
}

export function addResumes(files) {
  const prev = getResumes()
  const merged = [...files, ...prev].slice(0, 20)
  writeJson(scopedKey(RESUME_KEY), merged)
  return merged
}

export function removeResume(resumeId) {
  const prev = getResumes()
  const next = prev.filter((item) => item.id !== resumeId)
  writeJson(scopedKey(RESUME_KEY), next)
  return next
}

export function getRecentJobs() {
  return readJson(scopedKey(RECENT_KEY), [])
}

export function pushRecentJob(job) {
  const prev = getRecentJobs()
  const next = [job, ...prev.filter((item) => item.id !== job.id)].slice(0, 20)
  writeJson(scopedKey(RECENT_KEY), next)
  return next
}

export function getBookmarks() {
  return readJson(scopedKey(BOOKMARK_KEY), [])
}

export function toggleBookmark(job) {
  const prev = getBookmarks()
  const exists = prev.some((item) => item.id === job.id)
  const next = exists ? prev.filter((item) => item.id !== job.id) : [job, ...prev]
  writeJson(scopedKey(BOOKMARK_KEY), next)
  return next
}
