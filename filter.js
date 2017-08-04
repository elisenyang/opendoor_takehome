var reader = require('./data.js')

let data
reader()
.then((result)=>{
  data = result
})


module.exports = function filter(query) {
  return new Promise ((res,rej)=> {
    if(!query.min_price) {
      query.min_price = 0
    }

    if (!query.max_bed) {
      query.max_price = 300000
    }

    if(!query.min_bed) {
      query.min_bed = 0
    }

    if(!query.max_bed) {
      query.max_bed = 5
    }

    if(!query.min_bath) {
      query.min_bath = 0
    }

    if(!query.max_bath) {
      query.max_bath = 3
    }

    let filtered = []
    data.forEach(listing => {
      if ((parseInt(listing.price) >= parseInt(query.min_price))
      && (parseInt(listing.price) <= parseInt(query.max_price))
      && (parseInt(listing.bathrooms) >= parseInt(query.min_bath))
      && (parseInt(listing.bathrooms) <= parseInt(query.max_bath))
      && (parseInt(listing.bedrooms) >= parseInt(query.min_bed))
      && (parseInt(listing.bedrooms) <= parseInt(query.max_bed))) {
        filtered.push(listing)
      }
    })
    res(filtered)
  })
}
