const whatsappModels = require('../models/whatsapp')
const { getBookings } = require('../api/motopress/bookings')

const https = require('https')
const dotenv = require('dotenv')
dotenv.config()

function sendMessage(messageObject) {
  const options = {
    host: 'graph.facebook.com',
    path: '/v19.0/382988971554015/messages',
    method: 'POST',
    body: messageObject,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FACEBOOK_AUTHORIZATION_TOKEN}`,
    },
  }

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d)
    })
  })

  req.on('error', (error) => {
    console.error('Error', error)
  })

  req.write(messageObject)
  req.end()
}

async function processMessage(message, number) {
  const normalizeMessage = message.toLowerCase()
  let models = []

  if (normalizeMessage.includes('hola')) {
    const bookings = await getBookings()

    let model = whatsappModels.message(
      '¡Hola! Bienvenido, Soy tu asistente virtual Sofia. ¿En qué puedo ayudarte hoy?',
      number
    )

    const rows = [
      {
        id: '1',
        title: 'Reservar un alojamiento',
      },
      {
        id: '2',
        title: 'Planes turisticos',
      },
      {
        id: '3',
        title: 'Consultar disponibilidad',
      },
      {
        id: '4',
        title: 'Hablar con un agente',
      },
    ]

    let listModel = whatsappModels.interactiveList(number, rows)

    models.push(listModel)
    models.push(model)
  } else if (normalizeMessage.includes('salir')) {
    let model = whatsappModels.message(
      'Me alegra haber podido ayudarte',
      number
    )
    models.push(model)
  } else {
    let model = whatsappModels.message(
      'Lo siento, No comprendí tu respuesta',
      number
    )
    models.push(model)
  }
  models.forEach((model) => {
    sendMessage(model)
  })
}

module.exports = {
  sendMessage,
  processMessage,
}
