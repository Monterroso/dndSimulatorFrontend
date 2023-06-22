
const mocker = ((mock, axios) => {
  
  mock
  .onGet(/\/api\/games\/[0-9]*\/changes\/[0-9]*/)
  .reply(async function(config) {
    const urlRegex = config.url.match(/([0-9]*)\/changes\/([0-9]*)/)
    const gameNumber = urlRegex[1]
    const changenumber = urlRegex[2]

    const data = await axios.get(`data/game${gameNumber}.json`)
    .then(reponse => reponse.data)
    .then(data => data[changenumber])

    return [200, data]
  })
})

export default mocker


