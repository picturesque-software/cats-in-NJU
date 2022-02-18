
// document.ready(function () {
//     alert('ready'); // 先执行
// });
window.onload=function(){
    var obj = document.getElementById("original-image");
    obj.src="/images/"+ getCookie('id') +".jpg"

}

function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length; //属性名的长度
    var clen = document.cookie.length;  //cookie的长度
    var i = 0;
    while (i < clen) {
        var j = i + alen;    // 属性名的长度
        if (document.cookie.substring(i, j) == arg) return getCookieVal(j);  //第一次循环得到一个cookie值。
        i = document.cookie.indexOf(" ", i) + 1; //一个新的起始位置,也就是下一个位置,  相当于是搜索了。
    }
    return null;
}

function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset); //结束位置
    if (endstr == -1) endstr = document.cookie.length; //没有找到就是cookie的条数
    return unescape(document.cookie.substring(offset, endstr));
}


var originalImage = document.getElementById("original-image");
var filteredImageCanvas = document.getElementById("filtered-image");
var filterChanger = document.getElementById("filter-changer");


// Handle image upload into img tag



filterChanger.addEventListener("change", function(e){
	var filter = filterChanger.value;
  	
  if(filter != "none"){
  
  	// Apply filter
  	LenaJS.filterImage(filteredImageCanvas, LenaJS[filter], originalImage);
  }
}, false);


