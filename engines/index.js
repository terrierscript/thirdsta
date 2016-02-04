import websta from "./websta"
import tofo from "./tofo"
import fs from "fs"

const reducePage = (results, page, depth) =>{
  return page.request().then( parser => {
    console.log(depth)
    let nextPage = parser.next()
    let nextResults = results.concat(parser.parse())
    if(nextPage && depth < 30){
      return reducePage(nextResults, nextPage, depth + 1)
    }
    return nextResults
  })
}

const crawl = ( depth = 10 ) =>{
  let userName = "sqlatchdog"
  let userId = "1453092205"

  // let page = websta( userName )
  let page = tofo( userId )
  return reducePage([], page, 0)
}

const start = () => {

  crawl().then( item => {
    let json = JSON.stringify(item, null, 2)
    fs.writeFileSync("./foo.json", json)
    console.log(item)
  }).catch(e => {
    console.error(e.stack)
  })
}
start()