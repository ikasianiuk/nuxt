import Vue from 'vue'

const pushArtefactAction = action => {
  var artefact = window.artefact || (window.artefact = {})
  var actions = artefact.actions || (artefact.actions = [])
  return actions.push(action)
}

Vue.prototype.$pushArtefactAction = pushArtefactAction
