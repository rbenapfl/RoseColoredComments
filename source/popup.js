document.addEventListener('DOMContentLoaded', function () {
  commentGenerator.showComments();
});

var commentGenerator = {

  showComments: function() {
    var box = document.getElementById('commentBox')
    console.log("work")
    console.log(box)
    box.innerText = "Hi"
  }

} 
