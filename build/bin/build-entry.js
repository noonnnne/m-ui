const Components = require('./components-helpers').getComponents()
const fs = require('fs')
const uppercamelcase = require('uppercamelcase')
const path = require('path')
const version = process.env.VERSION || require('../../package.json').version
const tips = '// This file is auto gererated by build/bin/build-entry.js'

function buildWevueEntry () {
  const uninstallComponents = [
    // 'Lazyload',
    // 'InfiniteScroll',
    // 'Dialog',
    // 'Toast',
    // 'TopTips'
  ]

  const importList = Components.map(name => `import ${uppercamelcase(name)} from './components/${name}'`)
  const exportList = Components.map(name => `${uppercamelcase(name)}`)
  const intallList = exportList.filter(name => !~uninstallComponents.indexOf(uppercamelcase(name)))

  const content = `${tips}
// import 'weui/dist/style/weui.min.css'
// import '../src/style/component.scss'
${importList.join('\n')}

const version = '${version}'
const components = [
  ${intallList.join(',\n  ')}
]

const install = (Vue, config = {}) => {
  components.forEach(Component => {
    Vue.use(Component)
  })

  // Vue.use(InfiniteScroll)
  // Vue.use(Lazyload, {
  //  loading: require('./assets/loading-spin.svg'),
  //  attempt: 3,
  //  ...config.lazyload
  // })

  // Vue.$dialog = Vue.prototype.$dialog = Dialog
  // Vue.$toast = Vue.prototype.$toast = Toast
  // Vue.$toptips = Vue.prototype.$toptips = TopTips
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  install,
  version
}

export default {
  install,
  version
}
`
  const OUTPUT_PATH = path.join(__dirname, '../../src/index.js')
  // ${exportList.join(',\n  ')}

  fs.writeFileSync(OUTPUT_PATH, content)
  console.log('[build entry] DONE:', OUTPUT_PATH)
}

buildWevueEntry()
