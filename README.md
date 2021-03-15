# nuxt

> Nuxt.js project

## Getting Started

### What tooling do I need

Make sure you have installed the following:

  - Docker with docker compose for local development(please make sure that it could run without sudo.
    How to run docker without sudo - https://github.com/sindresorhus/guides/blob/master/docker-without-sudo.md )
  - GNU make
  
### How do I start developing for the fist time

Run the following command from the project root to automatically build and start the application using Docker:

``` bash 
make init
```


 - The app should now be available on URL http://localhost:3000/, and it can be stopped with Ctrl+c

### Other Commands

Other useful commands can be found by running:

``` bash 
 make info 
````

## Prepare for production

``` bash
# docker build -t {image-name} .
# docker run --rm -it -p 3000:3000 --name={container-name} {image-name}
```

## Memory leak attention

Some plugins used by nuxt represent functions:

```javascript
  // file: .../plugins/sample-plugin.js

  export default ({ app }) => {
    ...
  })
```

If (**avoid it as much as possible**) you need to add *Vue* filter/mixin/plugin inside of such function, be aware of the fact, that this function is called every time a request is made, and mixins, plugins, filters are applied each time, using more and more RAM:

```javascript
  
  Vue.mixin({
    created() {
      console.log('show only one')
    }
  })
  
  Vue.mixin({
    created() {
      console.log('show only one')
    }
  })
  
  Vue.mixin({
    created() {
      console.log('show only one')
    }
  })

  new Vue({
    el: "#app"
  })
  
  // console will output 'show only one' 3 times
```

In order to avoid this you can use simple boolean flag to avoid multiple appliance of same code:

```javascript
  // file: .../plugins/sample-plugin.js
  
  let isMixinInstalled = false
  
  export default ({ app }) => {
    if (isMixinInstalled) { return }
     
    Vue.mixin({
      created() {
        console.log('show only one')
      }
    })
      
    isMixinInstalled = true 
  }
```

Outside of this function you can safely do *Vue* installing of stuff you need

## Running local e2e tests
 
You might need to stop development mode first:
 first
 ```bash
make stop
```
Make sure you have all required packages (selenium and chrome webdrivers) installed locally.
To install/reinstall packages use
```bash
make reinstall 
``` 
Start the application running
 
```bash
make app-start
```

Then run the tests in a new terminal tab or window
``` bash
make test-e2e
```

TODO: the intention is to replace these e2e tests with something that will run in all environments without local setup
