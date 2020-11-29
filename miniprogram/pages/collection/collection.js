const app = getApp();
Page({
    data: {
        'record': null, //record = [{link, music, pic, ispermanent}]
        'play': 0,
        'playButtonPic':"../../images/play.png",
        'count': 0,
        'value': null,
        'sharelink': null,
        'currentTime': 0,
        'duration': 1,
        'currentPercent': 0,
        'cut': 0,
        'left': 0,
        'right': 100,
        'firstStrike': 1
    },
    onLoad: function () {
        this.f = swan.getFileSystemManager();
        this.swipeInit();
        this.audioInit();
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
    swipeInit() {
        this.setData({
            record: app.globalData.record,
            value: app.globalData.record[0] ? app.globalData.record[0].value : null,
            count : 0,
            currentPercent: 0
        })
    },
    swipeChange(e){
        this.setData({
            playButtonPic: "../../images/play.png",
            play: 0,
            count: e.detail.current,
            value: this.data.record[e.detail.current].value
        })
        this.data.audio.stop();
        this.audioInit();
    },
    audioInit() {
        if(this.data.audio){
            this.data.audio.offTimeUpdate()
        }else{
            const audio = swan.createInnerAudioContext();
            this.data.audio = audio;
        }
        if (this.data.record.length) {
            this.data.audio.src = this.data.record[this.data.count].link
            this.data.interval = setInterval(() => {
                this.audioUpdate(this)
            }, 1000);
            this.data.audio.onEnded(res =>{
                this.audioStop()
            })
        }
    },
    audioUpdate(that){
        if(that.data.play){
            if(that.data.cut && that.data.currentTime > that.data.right * that.data.duration / 100)
            that.audioStop()
            console.log('audioUpdate:' +    that.data.audio.currentTime)
            console.log('that.data.firstStrike:' + that.data.firstStrike)
            if(!that.data.firstStrike)
            that.setData({
                'currentTime': (that.data.audio.currentTime + 1),
                'duration': that.data.audio.duration,
                'currentPercent':  (that.data.audio.currentTime + 1) /  that.data.audio.duration * 100
            })
        else
            that.data.firstStrike = 0
        }
    },
    sliderChanging() {
        if(this.data.play)
            this.audioPause();
    },
    sliderChange(e) {
        let value = parseInt(e.detail.value * this.data.duration / 100)
        this.setData({
            'currentTime': value,
            'currentPercent': value * 100 / this.data.duration
        })
        console.log('SilderChange, seekIndex:' + e.detail.value * this.data.duration / 100)
        this.data.audio.seek(e.detail.value * this.data.duration / 100)
        this.data.audio.currentTime = e.detail.value * this.data.duration / 100
        if (this.data.play)
            this.data.audio.play();
    },
    playButtonPress() {
        if (this.data.play === 0)
            this.audioPlay();
        else
            this.audioPause();
    },
    audioPlay() {
        if(this.data.record.length){
            this.data.audio.play();
            this.setData({
                play: 1,
                playButtonPic: "../../images/pause.png"
            })
        }
    },
    audioStop(){
        if(this.data.record.length){
            this.data.audio.stop();
            this.setData({
                play: 0,
                playButtonPic: "../../images/play.png",
                currentPercent: 0,
                currentTime: 0,
        })
        this.data.audio.currentTime = 0
        this.data.firstStrike = 1
    }
    },
    audioPause() {
        if(this.data.record.length){
            this.data.audio.pause();
            this.setData({
                play: 0,
                playButtonPic: "../../images/play.png"
            })
        }
    },
    renamefile(e) {
        this.data.record[this.data.count].value = e.detail.value
        this.f.rename({
            oldPath: this.data.record[this.data.count].link,
            newPath: `${swan.env.USER_DATA_PATH}/${this.data.record[this.data.count].value}.aac`,
            success: res=>{
                swan.showToast({
                    title:"修改成功",
                })
            },
            fail: res=>{
                swan.showToast({
                    title: '修改失败',
                    icon : 'none'
                })
            }
        })
        this.data.record[this.data.count].link = `${swan.env.USER_DATA_PATH}/${this.data.record[this.data.count].value}.aac`
    },
    share() {
        if (!this.data.record.length) {
            swan.showToast({
                title: '录音文件不存在',
                icon: 'none'
            })
        } else {
            swan.shareFile({
                filePath: this.data.record[this.data.count].link,
                success: res => {
                    swan.showToast({
                        title: '分享成功',
                        icon: 'none'
                    })
                },
                fail: err => {
                    swan.showToast({
                        title: '分享失败',
                        icon: 'none'
                    })
                }
            })

        }
    },
    remove(){
        console.log(this.data.audio)
        swan.showModal({
            content: '是否真的要删除该文件',
            success : res =>{
                if(res.confirm){
                    app.globalData.record.splice(this.data.count, 1)
                    console.log(app.globalData.record)
                    this.swipeInit();
                    this.audioInit();
                }
            }
        })
    }
});