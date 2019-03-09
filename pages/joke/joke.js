/**
 * 引入外部js  
 * 
 * 
 * 实际上require('../../utils/config.js')它是等于module.exports。
                            {
                              textJoke: textJoke,
  而module.exports是等于       imgJoke: imgJoke,
                              gifJoke: gifJoke
                            }
 * 
 * 
                  {
                    textJoke: textJoke,
  所以url也等于      imgJoke: imgJoke,
                    gifJoke: gifJoke
                  }
 */




var url = require('../../config.js');
var jumpFlag = true;

Page({


  data: {
    flag: false,    //控制页面的显示与隐藏
    loadingMore: false,   //加载更多的显示与隐藏
    loadingOver: false,   //加载完的显示与隐藏
    data: [],   //接收接口返回的数据
    color: ['one', 'two', 'three'],  //颜色类名
    pageNum: 1,   //请求的是第几页
  },


  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });

    this.request(); //载入页面是请求数据

  },

  request: function () {
    var self = this;
    var time = new Date().getTime(); //获取时间戳
    wx.request({
      url: url.textJoke,     //还有url.imgJoke和url.gifJoke
      data: {
        showapi_timestamp: time,
        page: this.data.pageNum,
        maxResult: 40   //每页的笑话个数（记录数）
      },
      success: function (e) {
        console.log(e);
        var data = e.data.showapi_res_body.contentlist;
        var length = data.length;

        if (length == 0) { //如果没有数据就显示“已加载全部”并结束执行
          self.setData({
            loadingMore: false,
            loadingOver: true
          });

          return;
        }


        //旧数组与新数组的连接，连接后的新数组返回去覆盖老数组
        var list = self.data.data.concat(data);

        //把每一项的内容部分传到方法removeHtml进行去Html标签，返回后的值覆盖原来的值
        for (var i = 0; i < data.length; i++) {
          data[i].text = self.removeHtml(data[i].text);
        }
        self.setData({
          data: list,
          flag: true,
          loadingMore: false, //加载后让“加载更多数据”隐藏
        });

        wx.hideLoading(); //请求到数据关闭我们的加载动画
        wx.stopPullDownRefresh();//请求到数据后关闭我们的刷新动画
      }
    })

  },

  //执行跳转的方法 其中jumpFlag用于防止用户多次点击
  jump: function (e) {
    if (jumpFlag) {
      jumpFlag = false;
      var id = e.currentTarget.id;
      var temp = JSON.stringify(this.data.data[id]);//转为JSON字符串
      wx.navigateTo({
        url: '../textJoke/textJoke?data=' + temp,
      })
    }
  },

  //去Html标签
  removeHtml: function (str) {
    return str.replace(/<[^>]+>/g, '');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    jumpFlag = true;  //当页面再次显示时，更新一下值
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用用scroll-view绑定的触顶事件（也就是我们的下拉刷新），它只是显示一下动画，需要自己关闭动画，同样会执行我们的onPullDownRefresh生命周期函数
   * 
   * upper: function() {
      wx.startPullDownRefresh({
  
      })
    },
   */

  /**
   * 用scroll-view绑定的触底事件（也就是我们的上拉加载）
   * 
   * lower: function() {
      console.log("123");
      this.setData({
        loadingMore: true,
        loadingOver: false,
        pageNum: this.data.pageNum + 1,
      });
      this.request();
    },
   * 
   */


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.request();   //重新请求数据实现更新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //当触底事件触发时、让pageNum加1后、请求数据实现加载数据
    this.setData({
      loadingMore: true,
      loadingOver: false,
      pageNum: this.data.pageNum + 1,
    });
    this.request();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})