var jsx = require('jsx-transform')

module.exports = function (content) {
  var done = this.async()
  new Promise(resolve => {
    content = jsx.fromString(content, {
      factory: 'h',
      unknownTagPattern: '{tag}'
    })
    resolve(content)
  })
  .then(content => done(null, content))
  .catch(err => done(err))
}
