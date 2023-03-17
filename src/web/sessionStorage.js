import parseSession from "@/web/parseSession.js"
import config from "@/web/config.js"

const sessionStorage = (jwt) => {
  if (jwt) {
    localStorage.setItem(
      config.session.localStorageKey,
      JSON.stringify(parseSession(jwt))
    )

    return
  }

  const token = localStorage.getItem(config.session.localStorageKey)

  if (!token) {
    return null
  }

  return JSON.parse(parseSession(token))
}

export default sessionStorage
