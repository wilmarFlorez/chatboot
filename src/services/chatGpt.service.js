const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
})

async function main(text) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: text }],
    model: 'gpt-3.5-turbo',
  })

  console.log('chatCompletion', chatCompletion)

  const message = chatCompletion.choices[0].message.content
  return message
}

module.exports = {
  main,
}
