document.addEventListener('DOMContentLoaded', function () {
  BadWordList = ["bad","terrible","waste","shit"]
  urlFetcher.getUrl()
})

var urlFetcher = {
  getUrl: function(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url
      var apiUrl = urlFetcher.prepareUrl(url)
      commentGenerator.getComments(apiUrl)
    })
  },
  prepareUrl: function(url) {
    var videoId = urlFetcher.extractVideoId(url)
    var urlString = 'https://gdata.youtube.com/feeds/api/videos/' + videoId + '/comments?v=2&alt=json&max-results=50'
    return urlString
  },
  extractVideoId: function(url) {
    var regex = /v=(.*)/
    var matchArray = regex.exec(url)
    return matchArray[1]
  }
}
var commentGenerator = {

  getComments: function(url) {
    $.ajax({
      type: 'GET',
      dataType:"json",
      url: url,
      success: function(responseObject) {
        commentParser.init(responseObject)     
      }
    })
  }
}

var commentParser = {
  init: function(responseObject) {
    var parsedArray = commentParser.extractComments(responseObject)
    var sortedArray = wordFilter.filterBadComments(parsedArray)
    commentAppender.appendComments(sortedArray)

  },
  extractComments: function(responseObject) {
    var commentArray = responseObject.feed.entry
    var parsedComments = []
    for (var i = 0;i<commentArray.length;i++){
      var comment = commentArray[i].content.$t
      var author = commentArray[i].author[0].name.$t
      var authorLink = "http://www.youtube.com/profile_redirector/" + commentArray[i].yt$googlePlusUserId.$t
      parsedComments.push({commentContent:comment,authorUrl:authorLink,authorName:author})
    }
    return parsedComments
  }
}

var commentAppender = {
  appendComments: function(filteredArray) {
    for (var i = 0;i<filteredArray.length;i++) {
      var currentComment = filteredArray[i]
      var commentText = currentComment.commentContent
      var authorName = currentComment.authorName
      var commentDiv = "<div class='comment'>" + commentText +"</br>" + "-" + authorName + "</div>"
      $('#commentBox').append(commentDiv)
    }
  }
}
 var wordFilter = {
  filterBadComments: function(parsedArray) {
    var filteredArray = parsedArray
    for (var i = 0;i<filteredArray.length;i++) {
      var string = filteredArray[i].commentContent
      for (var y = 0;y<BadWordList.length;y++){
        var word = BadWordList[y]
        if (wordFilter.regexFilter(word,string)) {
          filteredArray.splice(i,1)
          i--
          break
        }
      }
    }
    return filteredArray
  },
  regexFilter: function(word,string) {
    return new RegExp( '\\b' + word + '\\b', 'i').test(string)
  }
 }
