const express = require('express')
const cors = require('cors')

const app = express()

app.listen(5500, () => console.log('Rodando na porta 5500'))

app.use(cors())

app.use(express.json())

let users = [{
  id: 1,
  name: "Jakeliny Gracielly",
  avatar: "https://avatars.githubusercontent.com/u/17316392?v=4",
  city: "São Paulo"
}]

const default_ex_obj = users[0]

const example_user = {
  id: 99,
  name: "Vitor Markis",
  avatar: "https://avatars.githubusercontent.com/u/121525239?v=4",
  city: "Rio Grande do Sul"
}

// Função que checa se as chaves do objeto recebido no corpo, batem com as chaves do objeto exemplo
// Nota: Caso não opte por utilizar um objeto separado como exemplo, por padrão ele usará o da Jake
function isValidKeys(current_obj, example_obj = default_ex_obj) {
  let curr_keys = Object.keys(current_obj)
  let exam_keys = Object.keys(example_obj)
  return curr_keys.every(curr_key => exam_keys.includes(curr_key))
}

// Rota para qualquer usuário saber quais as chaves permitidas
app.route('/api/valid-keys').get((req, res) => {
  let exam_keys = Object.keys(default_ex_obj)
  res.json(exam_keys)
})

app.route('/api').get((req, res) => res.json({
  users
}))

app.route('/api/:id').get((req, res) => {
  const userId = req.params.id

  const user = users.find(user => Number(user.id) === Number(userId))

  if (!user) {
    return res.json('User nor found!')
  }

  res.json(user)
})

app.route('/api').post((req, res) => {
  if(!isValidKeys(req.body)) {
    return res.json('Apenas valores válidos podem ser registrados.')
  }
  
  const lastId = users[users.length - 1].id
  users.push({
    id: lastId + 1,
    name: req.body.name,
    avatar: req.body.avatar,
    city: req.body.city
  })
  res.json('Saved user')
})

app.route('/api/:id').put((req, res) => {
  if(!isValidKeys(req.body)) {
    return res.json('Apenas valores válidos podem ser registrados.')
  }

  const userId = req.params.id

  const user = users.find(user => Number(user.id) === Number(userId))

  if (!user) {
    return res.json('User nor found!')
  }

  const updatedUser = {
    ...user,
    name: req.body.name,
    avatar: req.body.avatar,
    city: req.body.city
  }

  users = users.map(user => {
    if (Number(user.id) === Number(userId)) {
      user = updatedUser
    }
    return user
  })

  res.json("Updated user")
})

app.route('/api/:id').delete((req, res) => {
  const userId = req.params.id

  users = users.filter(user => Number(user.id) !== Number(userId))

  res.json('Deleted User')
})