function bind_video_lightbox(elem){
  var href = elem.attr('href');
  elem.click(function(e){
    e.preventDefault();
    var elem = $('<div id="video_wrap"><div class="player"><iframe id="parentframe" src="/engine/widget?u='+href+'"></iframe></div><div class="background"></div></div>');
    $("body").append(elem);
    elem.ready(function(){
      elem.fadeIn(300);
      var video = elem.find("iframe");

      //iframeサイズをフィッティング
      //https://webllica.com/set-iframe-height-dynamic/
      var interval = setInterval(function(){
        video[0].style.height = video[0].contentWindow.document.body.scrollHeight+"px";
        if(video.height() > 50) clearInterval(interval);
      },500);
      
      //スワイプで削除処理
      //移動する要素の親要素(スワイプ後の位置を確認するのに使用)
      var isTouch = ('ontouchstart' in window);
      var background = elem.children(".background");
      var item = elem.children(".player");
      var over = $(window).height()*0.15;
      var basePoint;
      //長押しを検知する閾値
      var longpress = 300;
      //移動する要素にイベントが発生した時
      item.bind({
        //タッチ開始
        'touchstart mousedown': function(e) {
          e.preventDefault();
          //画面の上端からの座標
          this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
          //basePointとthis.topに現在のtopの値(0)を追加
          basePoint = this.top = parseFloat($(this).css('top'));
          this.touched = true;
          //長押し時クラス付与して要素が消されるのを防ぐ
          timer = setTimeout(function(){
            elem.addClass('swipeing');
          }, longpress);
        },
        //タッチ中
        'touchmove mousemove': function(e) {
          if(!this.touched) return;
          e.preventDefault();
          //移動要素のtopに入れる値
          this.top = parseFloat($(this).css('top')) - (this.pageY - (isTouch ? event.changedTouches[0].pageY : e.pageY) );
          $(this).css('top',this.top);
          if(this.top>0) {
            background.css('opacity',1-(this.top/300));
          } else {
            background.css('opacity',1-(this.top/300*-1));
          }
          //画面の上端からの座標
          this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
        },
        //タッチ終了
        'touchend mouseup': function(e) {
          if(!this.touched) return;
          this.touched = false;
          //長押し終わり
          clearTimeout(timer);
          //移動要素が親要素の範囲より上下にはみ出しているとき
          if(this.top > over || this.top < over*-1) {
            elem.fadeOut(300,function(){
              elem.remove();
            });
          } else {
            $(this).animate({top: 0}, 200);
            background.css('transition','0.3s');
            background.css('opacity',1);
          }
          //クリックで削除処理
          //長押し時要素が消されるのを防いでいる
          if(!$(e.target).closest("iframe").length) {
            if(!elem.hasClass('swipeing')){
              elem.fadeOut(300,function(){
                elem.remove();
              });
            }
          }
          elem.removeClass('swipeing');
        },
        //マウススクロール
        'wheel mousewheel': function(e) {
          elem.fadeOut(300,function(){
            elem.remove();
          });
        }
      });
    });
  });
}