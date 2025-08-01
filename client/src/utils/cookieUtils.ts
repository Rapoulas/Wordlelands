import CryptoJS from 'crypto-js'

const COOKIE_SECRET = import.meta.env.COOKIE_KEY || 'secret-key-fallback'

export const encryptCookie = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, COOKIE_SECRET).toString()
    const hmac = CryptoJS.HmacSHA256(encrypted, COOKIE_SECRET).toString()
    return `${encrypted} | ${hmac}`
  } catch (err) {
    console.error('Error encrypting cookies', err)
    return ''
  }
}

export const decryptCookie = (cookie: string): string | null => {
  try {
    const [encrypted, hmac] = cookie.split(' | ')
    if (!encrypted || !hmac) return null
    
    const expectedHmac = CryptoJS.HmacSHA256(encrypted, COOKIE_SECRET).toString()
    if (hmac != expectedHmac) {
      console.log("hmac invalid")
      return null
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, COOKIE_SECRET).toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch (err) {
    console.error('Error decrypting cookie: ', err)
    return null
  }
}