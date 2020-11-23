const app = getApp();
Page({
    data: {
        'music': "AndroidPorn",
        'start': 0,
        'audioSources': [],
        'cdn': "https://unique-baiduprogram.cdn.bcebos.com/",
        'extention': ".wav",
        'audioFilePath': [],
        'value': '',
        "status" : "录制",
        "arrow": "../../images/down.png",
        'list': [{
            'name': 'LimitLess',
            "extention": '.mp3'
        },{
            'name': 'AndroidPorn',
            "extention": '.wav'
        }],
        'select': 0
    },
    onLoad: function () {
        let that = this;
        swan.setInnerAudioOption({
            mixWithOther: true,
            fail: err => {
                swan.showModal({
                    title: '设置与其他音频混播失败',
                    content: JSON.stringify(err)
                });
                console.log('setInnerAudioOption fail', err);
            }
        });
        this.recorderManagerInit(that);
        //this.loadAudioFile();
        // swan.navigateTo({
        //     url: '../collection/collection'
        // })
        // 监听页面加载的生命周期函数

    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
    },
    onHide: function () {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function () {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function () {
        // 监听用户下拉动作
    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    },
    recorder() {
        let that = this;
        if (this.data.start)
            this.recorderManagerStop(that)
        else
            this.recorderManagerStart(that)
    },
    recorderManagerInit(that){
        app.globalData.recorderHistorylink = []
        app.globalData.recorderHistoryMusic = []
        swan.getAvailableAudioSources({
            success: res => {
                let arr = []
                for (let i = 1; i < res.audioSources.split('"').length; i += 2)
                    arr.push(res.audioSources.split('"')[i])
                that.setData({
                    'audioSources': arr
                });
                console.log('当前支持的音频输入源:', res.audioSources);
            },
            fail: res => {
                console.log('错误码: ' + err.errCode);
                console.log('错误信息: ' + err.errMsg);
            }
        })
        const recorderManager = swan.getRecorderManager();
        that.recorderManager = recorderManager;
        console.log(that.recorderManager);
        recorderManager.onStop(
            function(res) {
                console.log("record stop")
                swan.showModal({
                    title:"success",
                    content: res.tempFilePath
                })
                app.globalData.recorderHistorylink.push(res.tempFilePath);
                app.globalData.recorderHistoryMusic.push(that.data.music);
            }
        )

    },
    recorderManagerStart() {
        const options = {
            duration: 50000,
            sampleRate: 44100,
            numberOfChannels: 1,
            encodeBitRate: 96000,
            audioSource: this.data.audioSources.indexOf('camcorder') ? this.data.audioSources[this.data.audioSources.indexOf('camcorder')] : 'auto'
        };
        this.recorderManager.start(options);
        this.setData({
            status: "停止",
            start: 1
        })
    },
    recorderManagerStop() {
        this.recorderManager.stop();
        this.setData({
            start: 0,
            status: "录制"
        })
    },
    navigateTo(e) {
        swan.navigateTo({
            url: '../collection/collection'
        })
    },
    loadAudioFile() {
        this.data.audioFilePath = []
        for (let i = 1; i < 19; i++)
            swan.downloadFile({
                url: this.data.cdn + this.data.music + '/' + this.data.music + '_chip' + i + this.data.extention,
                success: res => {
                    this.data.audioFilePath[i] = res.tempFilePath;
                    console.log(res.tempFilePath);
                },
                fail: err => {
                    this.toast('下载文件失败');
                    console.log('错误码: ' + err.errCode);
                    console.log('错误信息: ' + err.errMsg);
                }
            })
    },
    play1() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[1];
        inneraudiocontext.play();
    },
    play2() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[2];
        inneraudiocontext.play();
    },
    play3() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[3];
        inneraudiocontext.play();
    },
    play4() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[4];
        inneraudiocontext.play();
    },
    play5() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[5];
        inneraudiocontext.play();
    },
    play6() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[6];
        inneraudiocontext.play();
    },
    play7() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[7];
        inneraudiocontext.play();
    },
    play8() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[8];
        inneraudiocontext.play();
    },
    play9() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[9];
        inneraudiocontext.play();
    },
    play10() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[10];
        inneraudiocontext.play();
    },
    play11() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[11];
        inneraudiocontext.play();
    },
    play12() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[12];
        inneraudiocontext.play();
    },
    play13() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[13];
        inneraudiocontext.play();
    },
    play14() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[14];
        inneraudiocontext.play();
    },
    play15() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[15];
        inneraudiocontext.play();
    },
    play16() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[16];
        inneraudiocontext.play();
    },
    play17() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[17];
        inneraudiocontext.play();
    },
    play18() {
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[18];
        inneraudiocontext.play();
    },
    selectMusic(){
        if(!this.data.select){
            this.setData({
                arrow: "../../images/up.png",
                select: 1
            })
        }
        else{
            this.setData({
                arrow: "../../images/down.png",
                select: 0
            })
        }
    }
});