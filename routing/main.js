const Shapi = require(`shapi`)
const { logger } = require('shapi/lib/std/mw/logger')
const { html, json } = require('shapi/std/replies')
const { readFileSync } = require(`fs`)

let users = JSON.parse(readFileSync('users.json').toString())

let api = new Shapi

// api.use(logger('[api]'))

let usersEndpoint = api.with('users')

usersEndpoint.with('get')
    .do(() => json(users))
    .on('{id: int}')
        .do(id => {
            return json({ user: users[id] })
        })
    .on('{name: string}')
        .do(name => {
            let tmp = []
            for (let id in users) {
                let user = users[id]
                if (user.name == name)
                    tmp.push(user)
            }
            return json(tmp)
        });

usersEndpoint.with('create')
    .on('{name: string}/{surname: string}')
    .do((name, surname) => {
        let ids = Object.keys(users)
        let lastID = parseInt(ids[ids.length - 1])
        let id = lastID + 1
        users[id] = { name, surname, id }
        return html(`
                    <h1>${name}</h1>
                    <h3>${surname}</h3>
                    `)
    })

usersEndpoint.with('get')
    .with('{somestuff}')
    .with('{otherstuff}')
    .with('{otherotherstuff}')
        .on('{id: int}').do((somestuff, otherstuff, otherotherstuff, id) => {
            return json({ somestuff, otherstuff, otherotherstuff, id })
        })

api.run()