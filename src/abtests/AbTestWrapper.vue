<template>
  <div
      @runabtest="onAbTestRun"
  >
    <div
      v-if="!isAbTestRunning"
    >
      <slot></slot>
    </div>
    <div v-else>
      <ab-test-renderer
        :parent="parent"
        :test-name="abTestName"
      />
    </div>

  </div>
</template>

<script>
import AbTestRenderer from './AbTestRenderer'
import allTests from './all-tests'
import { mapState } from 'vuex'

export default {
  name: 'AbTestWrapper',
  components: {
    AbTestRenderer
  },
  props: {
    // Need when you run ab-test globally
    testName: String,
    parent: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      abTest: false,
      localAbTestName: ''
    }
  },
  computed: {
    ...mapState('abtests', ['activeAbTests']),
    abTestName () {
      return this.localAbTestName || this.testName || ''
    },
    isAbTestRunning () {
      return this.abTest || this.activeAbTests.includes(this.abTestName)
    }
  },
  methods: {
    onAbTestRun (event) {
      const { name } = event.detail

      if (allTests[name]) {
        this.localAbTestName = name
        this.abTest = true
      }
    }
  }
}
</script>

