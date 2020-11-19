Page({
    data: {
        'start': 0,
        'audioSources': []
    },
    onLoad: function () {
        swan.navigateTo({
            url: '../collection/collection'
        })
        // 监听页面加载的生命周期函数
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    recorder(){
        let that = this;
        if(this.data.start)
            this.recorderManagerStop(that)
        else
            this.recorderManagerStart(that)
    },
    recorderManagerStart(that){
        swan.getAvailableAudioSources({
            success: res =>{
                let arr = []
                for(let i = 1; i < res.audioSources.split('"').length;i += 2)
                    arr.push(res.audioSources.split('"')[i])
                that.setData({
                    'audioSources': arr
                });
                console.log('当前支持的音频输入源:', res.audioSources);
            },
            fail: res =>{
                console.log('错误码: ' + err.errCode);
                console.log('错误信息: '+ err.errMsg);
            }
        })
        const recorderManager = swan.getRecorderManager();
        const options = {
            duration: 50000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 96000,
            audioSource: that.data.audioSources.indexOf('camcorder') ? that.data.audioSources[that.data.audioSources.indexOf('camcorder')] : 'auto'
        };
        recorderManager.start(options);
        this.recorderManager = recorderManager;
        this.setData({
            start: 1
        })
    },
    recorderManagerStop(that){
        this.recorderManager.stop();
        this.setData({
            start: 0
        })
    },
    navigateTo(e){
        swan.navigateTo({
            url: '../collection/collection'
        })
    }
});