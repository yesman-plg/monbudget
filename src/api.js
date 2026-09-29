async function lireReponse(response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

/** Appelle l'API homelab servie sur le même domaine que l'application. */
export async function appelerApi(chemin, options = {}) {
  const response = await fetch(`/api${chemin}`, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  const data = await lireReponse(response)

  if (!response.ok) {
    const erreur = new Error(data?.error ?? 'server_unavailable')
    erreur.code = data?.error ?? 'server_unavailable'
    erreur.status = response.status
    erreur.retryAfterSeconds = data?.retryAfterSeconds
    throw erreur
  }

  return data
}
