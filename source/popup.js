document.addEventListener('DOMContentLoaded', function () {
  urlFetcher.getUrl()
});

var urlFetcher = {
  getUrl: function(){
    $("body").append("hi")
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      var url = tabs[0].url
      commentGenerator.getComments(url);
    })
  }
}
var commentGenerator = {

  getComments: function(url) {
      $("body").append(url)
  }
}
