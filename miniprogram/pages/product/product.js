const app = getApp();
Page({
    data: {
        'record': null, //record = [{link, music, pic, ispermanent}]
        'link': null,
        'play': 0,
        'playButtonPic': "../../images/play.png",
        'count': 0,
        'value': null,
        'sharelink': null,
        'currentTime': 0,
        'duration': 1,
        'currentPercent': 0,
        'left': 0,
        'right': 100
    },
    onLoad: function () {
        this.f = swan.getFileSystemManager();
        console.log(this.f);
        this.setData({
            'link': app.globalData.temp.link,
            'music': app.globalData.temp.music
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
        arr.push({
            link: this.data.link,
            music: this.data.music,
            pic: "https://unique-baiduprogram.cdn.bcebos.com/pic/" + this.data.music + '.jpg',
            ispermanent: false,
            value: null
        })
        this.setData({
            record: arr,
            value: this.data.music
        })
    },
    audioInit() {
        const audio = swan.createInnerAudioContext();
        this.data.audio = audio;
        if (this.data.link) {
            audio.src = this.data.link
            audio.onTimeUpdate(res => {
                    console.log(res.data.currentTime)
                    this.setData({
                        'currentTime': res.data.currentTime,
                        'duration': res.data.duration,
                        'currentPercent': res.data.currentTime / res.data.duration * 100
                    })
                }),
                audio.onEnded(res => {
                    this.audioStop()
                })
        }
    },
    sliderChanging() {
        if (this.data.play)
            this.data.audio.pause();
    },
    sliderChange(e) {
        this.setData({
            'currentTime': e.detail.value * this.data.duration / 100,
            'currentPercent': e.detail.value
        })
        this.data.audio.seek(e.detail.value * this.data.duration / 100)
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
        this.data.audio.play();
        this.setData({
            play: 1,
            playButtonPic: "../../images/pause.png"
        })
    },
    audioStop() {
        this.data.audio.stop();
        this.setData({
            play: 0,
            playButtonPic: "../../images/play.png"
        })
    },
    audioPause() {
        this.data.audio.pause();
        this.setData({
            play: 0,
            playButtonPic: "../../images/play.png"
        })
    },
    renamefile(e) {
        this.data.value = e.detail.value
        console.log(this.data.value)
    },
    share() {
        if (!this.data.link) {
            swan.showToast({
                title: '录音文件不存在',
                icon: 'none'
            })
        } else {
            swan.shareFile({
                filePath: this.data.link,
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
    navback() {
        swan.navigateBack();
    },
    cut() {
        let that = this
        swan.showActionSheet({
            itemList: ['开始剪辑'],
            itemColor: 'grey',
            success: res => {
                that.setData({
                    cut: 1
                })
            }
        })
    },
    cancel() {
        this.setData({
            cut: 0
        })
    },
    save() {
        this.setData({
            cut: 0
        })
        this.f.saveFile({
            tempFilePath: this.data.link,
            filePath: `${swan.env.USER_DATA_PATH}/${this.data.value}.aac`,
            success: res => {
                swan.showToast({
                    title: "保存成功"
                })
                console.log(res.savedFilePath)
                this.data.record[0].link = res.savedFilePath
                this.data.record[0].permanent = true
                this.data.record[0].value = this.data.value
            },
            fail: err => {
                swan.showToast({
                    title: '保存失败',
                    icon: "none"
                })
            }
        })
        if (!app.globalData.record)
            app.globalData.record = []
        app.globalData.record.push(this.data.record[0])
        swan.navigateBack()
    }
});