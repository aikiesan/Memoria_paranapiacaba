// Gera o QR Code do app (SVG para a tela + PNG em alta para imprimir).
// Uso: npm run qrcode   (roda automaticamente antes de cada build)
import QRCode from 'qrcode'
import { mkdirSync } from 'node:fs'

export const URL_APP = 'https://aikiesan.github.io/Memoria_paranapiacaba/'
const opcoes = { errorCorrectionLevel: 'M', margin: 2, color: { dark: '#2A2420', light: '#FFFFFF' } }

mkdirSync('public', { recursive: true })
await QRCode.toFile('public/qrcode.svg', URL_APP, { ...opcoes, type: 'svg' })
await QRCode.toFile('public/qrcode.png', URL_APP, { ...opcoes, type: 'png', width: 1200 })
console.log(`QR Code gerado para ${URL_APP} → public/qrcode.svg e public/qrcode.png`)
