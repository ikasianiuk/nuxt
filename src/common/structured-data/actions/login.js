export function addLoginAction (customerData) {
  return {
    '@context': 'http://schema.org',
    '@type': 'InteractAction',
    'name': 'login',
    'description': '',
    'identifier': customerData.id,
    'startTime': new Date().toISOString(),
    'endTime': new Date(customerData.authToken.expires).toISOString()
  }
}
