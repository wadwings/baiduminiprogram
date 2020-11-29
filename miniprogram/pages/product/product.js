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
        'right': 100,
        'pause': 0,
        'firstStrike': 1
    },
    onLoad: function () {
        this.f = swan.getFileSystemManager();
        swan.setInnerAudioOption({
            mixWithOther: true
        })
        console.log('app.globalData: '+ app.globalData.temp)
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
        this.audioStop()
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
        let that = this
        if (this.data.link) {
            audio.src = this.data.link
            this.setData({
                duration: this.data.audio.duration
            })
            console.log(this.data.audio)
            this.data.interval = setInterval(() => {
                this.audioUpdate(this)
            }, 1000);
            this.data.audio.onEnded( () =>{
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
    sliderChanging(e) {
        if (this.data.play)
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
        console.log('audioPlay')
        if(this.data.cut && this.data.currentTime == 0){
            this.data.audio.seek(this.data.left * this.data.duration / 100)
            this.data.audio.currentTime = this.data.left * this.data.duration / 100
        }
        console.log(this.data.currentTime)
        this.data.audio.currentTime = this.data.currentTime
        this.data.audio.play();
        this.setData({
            play: 1,
            playButtonPic: "../../images/pause.png"
        })
    },
    audioStop() {
        console.log('audioStop')
        this.setData({
            currentTime: 0,
            currentPercent: 0,
            play: 0,
            playButtonPic: "../../images/play.png"
        })
        this.data.audio.currentTime = 0
        this.data.firstStrike = 1
    },
    audioPause() {
        console.log('audioPause')
        this.data.audio.pause();
        this.setData({
            play: 0,
            playButtonPic: "../../images/play.png",
            firstStrike: 1
        })
    },
    renamefile(e) {
        this.data.value = e.detail.value
        console.log(this.data.value)
    },
    share() {
        console.log(this.data.link)
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
        this.audioStop()
    },
    cancel() {
        this.setData({
            cut: 0
        })
    },
    finish(){
        let that = this
        swan.showLoading({
            title:'loading'
        })
        swan.uploadFile({
            url:  "https://bemusician.uniquestudio.orange233.top/music/cut",
            filePath: this.data.link,
            name: 'myfile',
            formData: {
                startTime: this.data.left / 100 * this.data.duration,
                endTime: this.data.right / 100 * this.data.duration
            },
            success: res =>{
                console.log('uploadsuccess:' + res.statusCode)
                console.log(res.data)
                if(res.statusCode == 200){
                    swan.downloadFile({
                        url: 'https://bemusician.uniquestudio.orange233.top/music/cut/' + res.data,
                        success: res =>{
                            that.setData({
                                'link': res.tempFilePath
                            })
                            that.audioInit()
                            swan.hideLoading()
                            that.save(that)
                        }
                    })
                }
            }
        });
    },
    save(that) {
        if(!that)
            that = this
        that.setData({
            cut: 0
        })
        that.f.saveFile({
            tempFilePath: that.data.link,
            filePath: `${swan.env.USER_DATA_PATH}/${that.data.value}.aac`,
            success: res => {
                swan.showToast({
                    title: "保存成功"
                })
                console.log(res.savedFilePath)
                that.data.record[0].link = res.savedFilePath
                that.data.record[0].permanent = that
                that.data.record[0].value = that.data.value
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
        app.globalData.record.push(that.data.record[0])
        swan.navigateBack()
    },
    leftchange(e){
        this.data.left = e.detail.value
        console.log(this.data.right < this.data.left)
        if(this.data.left > this.data.right)
            this.setData({
                left: this.data.right - 1
            })
    },
    rightchange(e){
        this.data.right = e.detail.value
        console.log(this.data.right < this.data.left)
        if(this.data.right < this.data.left)
            this.setData({
                right: this.data.left + 1
            })
    }
});