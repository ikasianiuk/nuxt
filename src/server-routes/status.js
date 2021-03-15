// endpoint for CTS
// indicate that Nuxt is live
export default async function (req, res) {
  const resBody = {
    status: 'OK'
  }

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(resBody))
}
