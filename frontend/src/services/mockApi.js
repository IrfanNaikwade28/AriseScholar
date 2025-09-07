// Lightweight mock API for auth and data fetching.
// Persists to localStorage. Replace with real endpoints later.

import { decks as seedDecks, progressData as seedProgress } from '../mockData/studyData'
import { leaderboard as profileLeaderboard } from '../mockData/profile'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const KEY_USER = 'as:user' // legacy single-user cache (kept for compatibility)
const KEY_TOKEN = 'as:token' // legacy token cache (kept for compatibility)
const KEY_ACCOUNTS = 'as:accounts' // map email -> { name, email, password, xp, level, streak, cardsMastered }
const KEY_SESSION = 'as:session' // { email, token }
const KEY_DECKS = 'as:decks'

function readJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)) }

function randomFail(p = 0.08) { // 8% failure to test UI
  if (Math.random() < p) { const err = new Error('Network error (mock)'); err.code = 'NETWORK'; throw err }
}

function readAccounts() { return readJSON(KEY_ACCOUNTS, {}) }
function writeAccounts(obj) { writeJSON(KEY_ACCOUNTS, obj) }

function setSession(email) {
  const token = 'mock-token-' + Math.random().toString(36).slice(2)
  writeJSON(KEY_SESSION, { email, token })
  localStorage.setItem(KEY_TOKEN, token) // keep legacy in sync
  return token
}

function getSession() { return readJSON(KEY_SESSION, null) }

export async function signup({ name, email, password }) {
  await delay(500)
  if (!name || !email || !password) { const e = new Error('All fields required'); e.code = 'VALIDATION'; throw e }
  // Basic strong password: 8+ chars, upper, lower, digit
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  if (!strong.test(password)) { const e = new Error('Password must be 8+ chars with upper, lower, and a number'); e.code = 'VALIDATION'; throw e }
  randomFail()
  const accounts = readAccounts()
  if (accounts[email]) { const e = new Error('Email already registered'); e.code = 'VALIDATION'; throw e }
  const profile = { name, email, xp: 0, level: 1, streak: 0, cardsMastered: 0 }
  accounts[email] = { ...profile, password }
  writeAccounts(accounts)
  const token = setSession(email)
  writeJSON(KEY_USER, profile) // legacy cache
  return { user: profile, token }
}

export async function login({ email, password }) {
  await delay(400)
  if (!email || !password) { const e = new Error('Email and password required'); e.code = 'VALIDATION'; throw e }
  randomFail()
  const accounts = readAccounts()
  const acc = accounts[email]
  if (!acc || acc.password !== password) { const e = new Error('Invalid credentials'); e.code = 'AUTH'; throw e }
  const token = setSession(email)
  const { password: _pw, ...user } = acc
  writeJSON(KEY_USER, user) // legacy cache
  return { user, token }
}

export function getCurrentUser() {
  const sess = getSession()
  if (!sess?.email) return readJSON(KEY_USER, null)
  const accounts = readAccounts()
  const acc = accounts[sess.email]
  if (!acc) return readJSON(KEY_USER, null)
  const { password: _pw, ...user } = acc
  return user
}

export function getToken() { return localStorage.getItem(KEY_TOKEN) }

export function logout() {
  localStorage.removeItem(KEY_USER)
  localStorage.removeItem(KEY_TOKEN)
  localStorage.removeItem(KEY_SESSION)
}

// Decks & content
function ensureDecks() {
  const existing = readJSON(KEY_DECKS, null)
  if (!existing) writeJSON(KEY_DECKS, seedDecks)
  return readJSON(KEY_DECKS, seedDecks)
}

export async function getDecks() {
  await delay(300); randomFail(0.05)
  return ensureDecks()
}

export async function getDeckById(id) {
  await delay(200)
  const list = ensureDecks();
  const deck = list.find(d => d.id === id) || list[0]
  return deck
}

export async function getFlashcards(deckId) {
  await delay(250)
  const deck = await getDeckById(deckId)
  return deck.flashcards
}

export async function uploadNotes(fileName) {
  await delay(800); randomFail(0.06)
  if (!fileName) { const e = new Error('No file provided'); e.code = 'VALIDATION'; throw e }
  const newDeck = {
    id: 'deck-' + Math.random().toString(36).slice(2),
    title: fileName.replace(/\.[^/.]+$/, ''),
    subject: 'General',
    summaries: [
      'Auto-generated summary point 1 based on uploaded notes.',
      'Auto-generated summary point 2 with key concepts.',
    ],
    flashcards: [
      { q: 'Key concept from notes?', a: 'Generated answer 1.' },
      { q: 'Important definition?', a: 'Generated answer 2.' },
    ],
    quiz: [
      { id: 1, question: 'Generated MCQ?', options: ['A','B','C','D'], answer: 2, explanation: 'Mock explanation.' }
    ],
  }
  const list = ensureDecks();
  writeJSON(KEY_DECKS, [newDeck, ...list])
  return newDeck
}

// XP & quiz
export async function addXP(amount) {
  await delay(150)
  const sess = getSession(); if (!sess?.email) return null
  const accounts = readAccounts(); const acc = accounts[sess.email]; if (!acc) return null
  acc.xp = Math.max(0, (acc.xp || 0) + amount)
  // Simple leveling rule: every 1000 XP -> level up
  acc.level = Math.max(1, Math.floor((acc.xp || 0) / 1000) + 1)
  accounts[sess.email] = acc; writeAccounts(accounts)
  const { password: _pw, ...user } = acc
  writeJSON(KEY_USER, user)
  return user
}

export async function submitQuiz(deckId, answers) {
  await delay(500)
  const deck = await getDeckById(deckId)
  const correct = answers.filter(Boolean).length
  const total = deck.quiz.length
  const accuracy = Math.round((correct / total) * 100)
  const xpEarned = correct * 20
  await addXP(xpEarned)
  return { accuracy, xpEarned }
}

// Additional endpoints for parity with real backend contracts
export async function getQuiz(deckId) {
  await delay(200)
  const deck = await getDeckById(deckId)
  return deck.quiz
}

export async function updateFlashcardProgress(deckId, knownDelta = 1) {
  await delay(150)
  const user = await addXP(Math.max(0, knownDelta) * 10)
  return { ok: true, user }
}

export async function updateProgress(partial) {
  await delay(120)
  // no-op in mock; return merged progress for UI
  return { ...seedProgress, ...partial }
}

// Progress & leaderboard
export async function getProgress() {
  await delay(250)
  return seedProgress
}

export async function getLeaderboard() {
  await delay(200)
  return profileLeaderboard || []
}
