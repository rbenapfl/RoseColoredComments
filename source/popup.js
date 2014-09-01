document.addEventListener('DOMContentLoaded', function () {
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
    $('body').append(parsedArray[0].commentContent)
  },
  extractComments: function(responseObject) {
    var commentArray = responseObject.feed.entry
    var parsedComments = []
    for (var i = 0;i<commentArray.length;i++){
      var comment = commentArray[i].content.$t
      var authorLink = "http://www.youtube.com/profile_redirector/" + commentArray[i].yt$googlePlusUserId.$t
      parsedComments.push({commentContent:comment,authorUrl:authorLink})
    }
    return parsedComments
  }
}