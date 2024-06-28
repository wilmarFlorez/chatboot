const whatsappService = require('../services/whatsapp.service')

const verifyToken = (req, res) => {
  try {
    // This token is a generated random token
    let accessToken = 'SAFK23434JF8L38VLVM8O0'
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    if (challenge !== null && token !== null && token == accessToken) {
      res.status(200).send(challenge)
    } else {
      res.status(400).send()
    }
  } catch (error) {
    res.status(400).send()
  }
}

function getInteractiveMessage(messages) {
  const interactiveObject = messages['interactive']
  const typeInteractive = interactiveObject['type']
  console.log('Interactive object ==>', interactiveObject)

  if (typeInteractive === 'button_reply') {
    return interactiveObject['button_reply']['title']
  } else if (typeInteractive === 'list_reply') {
    return interactiveObject['list_reply']['title']
  } else {
    console.log("There isn't an interactive message")
  }
}

function getTextUser(messages) {
  let text = ''
  const typeMessage = messages['type']

  if (typeMessage === 'text') {
    text = messages['text']['body']
  } else if (typeMessage === 'interactive') {
    text = getInteractiveMessage(messages)
  } else {
    console.log("There isn't a message")
  }

  return text
}

const receiveMessage = async (req, res) => {
  try {
    const entry = req.body['entry'][0]
    const changes = entry['changes'][0]
    const value = changes['value']
    const messageObject = value['messages']

    console.log('Entry', entry)

    if (messageObject) {
      const messages = messageObject[0]
      const text = getTextUser(messages)
      const number = messages['from']

      if (text !== '') {
        await whatsappService.processMessage(text, number)
      }
    }

    res.send('EVENT_RECEIVED')
  } catch (error) {
    console.log(error)
    res.send('EVENT_RECEIVED')
  }
}

module.exports = {
  verifyToken,
  receiveMessage,
}
