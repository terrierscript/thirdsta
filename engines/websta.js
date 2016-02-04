import axios from "axios"
import cheerio from "cheerio"

const BASE_URL = "http://websta.me"

export class WebstaRequest{
  getUserPageUrl(user){
    let url = `${BASE_URL}/n/${user}`
    return new WebstaPage(url)
  }
  start(userName){
    return this.getUserPageUrl(userName).request()
  }
}

class WebstaPage{
  constructor(url){
    this.url = url
  }  
  request(){
    let p = axios(this.url)
    return this._toParser(p)
  }
  _toParser(p){
    return p.then(res => res.data).then(body => {
      return new WebstaParser(body, this.baseUrl)
    })
  }
}


class WebstaParser{
  constructor(body, baseUrl){
    this.body = body
    this.baseUrl = baseUrl
    this.$ = cheerio.load(this.body)
  }
  media(){
    return this.$(".photoeach").map((i, el) =>{
      return new WebstaMedia(el)
    }).get()
  }
  next(){
    let next = this.$("a[rel='next']").attr("href")
    if(!next){
      return
    }
    let url = `${BASE_URL}${next}`
    return new WebstaPage(url)
  }
  parse(){
    return this.media().map((p) => {
      return p.get()
    })
  }
}

class WebstaMedia{
  constructor(dom){
    this.$ = cheerio.load(dom)
  }
  get id(){
    let url = this.$(".mainimg").attr("href")
    return url.replace("/p/", "")
  }
  get like(){
    return parseInt(this.$(`.like_count_${this.id}`).text())
  }
  get comment(){
    return parseInt(this.$(`.comment_count_${this.id}`).text())
  }
  get tags(){
    return this.$(".caption strong a").map( (i, el) => {
      return this.$(el).text().replace(/^#/, "")
    }).get()
  }
  get filter(){
    return this.$(".secondinfo .filter")
  }
  get time(){
    let before = this.$(".firstinfo .time")
    // TODO
  }
  get(){
    return {
      id: this.id,
      like: this.like,
      comment: this.comment,
      tags: this.tags,
      filter: this.filter
    }
  }
}

