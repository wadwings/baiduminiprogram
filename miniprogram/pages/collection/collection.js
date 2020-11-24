const app = getApp();
Page({
    data: {
        'record': null, //record = [{link, music, pic, ispermanent}]
        'link': null,
        'play': 0,
        'playButtonPic':"../../images/play.png",
        'count': 0,
        'value': null,
        'sharelink': null,
        'pic': {
            'AndroidPorn': "https://images.pexels.com/photos/3489391/pexels-photo-3489391.jpeg",
        },
        'currentTime': 0,
        'duration': 1,
        'currentPercent': 0,
        'cut': 0,
        'left': 0,
        'right': 100
    },
    onLoad: function () {
        this.f = swan.getFileSystemManager();
        console.log(this.f);
        this.setData({
            'link': app.globalData.recorderHistorylink,
            'music': app.globalData.recorderHistoryMusic
        })
        this.swipeInit();
        console.log(this.data.record)
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
        let arr = []
        for (let i = 0; i < this.data.music.length; i++)
            arr.push({
                link: this.data.link[i],
                music: this.data.music[i],
                pic: this.data.pic[this.data.music[i]],
                ispermanent: false,
                value: null
            })
        this.setData({
            record: arr
        })
    },
    swipeChange(e){
        this.setData({
            playButtonPic: "../../images/play.png",
            play: 0,
            count: e.detail.current,
            value: this.data.record[e.detail.current].value
        })
        this.audio.stop();
        this.audioInit();
    },
    audioInit() {
        if(this.audio){
            this.audio.offTimeUpdate()
            this.audio.destory()
        }
        const audio = swan.createInnerAudioContext();
        this.audio = audio;
        if (this.data.link) {
            audio.src = this.data.link[this.data.count]
            audio.onTimeUpdate(res => {
                console.log(res.data.currentTime)
                this.setData({
                    'currentTime': res.data.currentTime,
                    'duration': res.data.duration,
                    'currentPercent': res.data.currentTime / res.data.duration * 100
                })
            }),
            audio.onEnded(res =>{
                this.audioStop()
            })
        }
    },
    sliderChanging() {
        if(this.data.play)
            this.audio.pause();
    },
    sliderChange(e) {
        this.setData({
            'currentTime': e.detail.value * this.data.duration / 100,
            'currentPercent': e.detail.value
        })
        this.audio.seek(e.detail.value * this.data.duration / 100)
        if(this.data.play)
            this.audio.play();
    },
    playButtonPress() {
        if (this.data.play === 0)
            this.audioPlay();
        else
            this.audioPause();
    },
    audioPlay() {
        this.audio.play();
        this.setData({
            play: 1,
            playButtonPic: "../../images/pause.png"
        })
    },
    audioStop(){
        this.audio.stop();
        this.setData({
            play: 0,
            playButtonPic: "../../images/play.png"
        })
    },
    audioPause() {
        this.audio.pause();
        this.setData({
            play: 0,
            playButtonPic: "../../images/play.png"
        })
    },
    renamefile(e) {
        this.f.saveFile({
            tempFilePath: this.data.link[this.data.count],
            filePath: `${swan.env.USER_DATA_PATH}/${e.detail.value}.aac`,
            success: res =>{
                swan.showToast({
                    title : "保存成功"
                })
                console.log(res.savedFilePath)
                this.data.record[this.data.count].link = res.savedFilePath
                this.data.record[this.data.count].permanent = true
                this.data.record[this.data.count].value = e.detail.value
            },
            fail: err =>{
                swan.showToast({
                    title: '保存失败',
                    icon: "none"
                })
            }
        })
    },
    share() {
        if (!this.data.link) {
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
    cut(){
        let that = this
        swan.showActionSheet({
            itemList : ['开始剪辑'],
            itemColor : 'grey',
            success: res =>{
                that.setData({
                    cut : 1
                })
            }
        })
    },
    cancel(){
        this.setData({
            cut : 0
        })
    },
    save(){
        this.setData({
            cut: 0
        })
    }
});