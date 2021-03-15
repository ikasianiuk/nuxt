# HOW TO TURN COMPONENT INTO A CHUNK

instead of using regular approach:

```
import LukeComponent from "@/components/star-wars/LukeComponent"
...
export default {
  components: {
    LukeComponent
  } 
}
```

do these steps:
1. go to `components.json` file inside this directory and add path to 
component you would like to turn into a chunk:
for example, `"@/components/star-wars/LukeComponent"`
2. then inside parent layout/page/component do this:
```
<template>
  <div>
    *shh* Luke, I am your father *shh*
    <component :is="jedai"> <<-- by assigning this variable with component name we will load it, until then no request is made
      NOOOO
    </component>
  </div>
</template>

<script>
import { asyncComponentImport } from '@/common/async-components/async-import' <<-- wrapper for async loading

export default {
  components: {
    ...asyncComponentImport('LukeComponent') <<-- tell app which component to load
  },
  data() {
    return {
      jedai: ''
    }
  },
  mounted() {
    this.jedai = 'LukeComponent' <<-- at the moment of assigning chunk with component will be fetched
  }
}
</script>
```
