export default function checkImageOrIterate (obj) {
  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object') {
        checkImageOrIterate(obj[property])
      } else if (typeof obj[property] === 'string' && obj[property].includes('media/')) {
        obj[property] = process.env.FALLBACK_IMAGE
      }
    }
  }
}
