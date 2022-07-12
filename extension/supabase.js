var totalUrl = async function(){
  const { data, error } = await supabase
  .rpc('total_rows', {
  })
  if (error) console.error(error)
    else console.log(data)
  var objTotal = data[0].row_num
    console.log('TOTAL URLS =>:', objTotal)
    return objTotal
  }
var totalUrls = totalUrl()

/**
 * 
 * @param {url: text} url 
 * @param {category: text} category 
 * 
 * Get a random link when clicking on Curiously button
 */

var getDocument = async function(url, category){
    const { data, error } = await supabase
      .rpc('all_url_random1', {
      })
    if (error) console.error(error)
    else console.log(data)
    
    var obj = data
    for (var i = 0; i < obj.length; i++){
      stumbleComplete(obj[i].url,obj[i].category_1);
      id = obj[i].id
      views = obj[i].views
      console.log('COUNT ID =>', id)
      console.log('COUNT VIEWS =>', views)
      updateView(id, views + 1)
      console.log('URL PARSE =>:',obj[i].url, 'CATEGORY PARSE =>:',obj[i].category_1)
    }
}

/**
 * 
 * @param {url: text} url 
 * @param {rabbitHoleCategory: text} rabbitHoleCategory 
 * 
 * Get a category based link while in Curiously Mode
 * 
 * Before: curiously_random5
 * Working: curiousmode18
 */
var getCuriouslyLink = async function(url, rabbitHoleCategory) {
  const { data, error } = await supabase
  .rpc('curiousmode18', {
    rabbitholecategory: rabbitHoleCategory,
    category_1: 'category_1',
    tablename: 'urls'
  })
  
  if (error) console.error(error)
  else console.log(data)

  var objCuriously = data
  console.log('GET CURIOUSLY URL =>:', objCuriously)

  for (var i = 0; i < objCuriously.length; i++){
    curiouslyComplete(objCuriously[i].url, objCuriously[i].category_1);
    id = objCuriously[i].id
    views = objCuriously[i].views
    console.log('CURIOUSLY COUNT ID =>', id)
    console.log('CURIOUSLY COUNT VIEWS =>', views)
    updateView(id, views + 1)
    console.log('TEST CURIOUSLY URL PARSE =>:',objCuriously[i].url, 'TEST CURIOUSLY CATEGORY PARSE =>:',objCuriously[i].category_1)
  }
}

/**
 * 
 * @param {id: text} id 
 * @param {view: int} view 
 * 
 * Update how many times a link has been viewed.
 */

var updateView = async function (id, views) {
  const { data, error } = await supabase
  .from('urls')
  .update({views: views})
  .filter('views', 'neq', 0)
  .filter('id', 'eq', id)

  if (error) console.error(error)
  else console.log(data)
}

// var reportDeadUrl = async function(id) {
//   break
// }

// var upVoteUrl = async function(id) {
//   break
// }

// var downVoteUrl = async function(id) {
//   break
// }

// var submitUrl = async function(){
//   break
// }

// var submitUrlCategory = async function(){
//   break
// }