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
    var urlString = 'https://gdata.youtube.com/feeds/api/videos/' + videoId + '/comments?v=2&alt=json'
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
    $('body').append(url)
    $.ajax({
      type: 'GET',
      dataType:"json",
      url: url,
      success: function(response){
// call parser code here      
      }
    })
  }
}
