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
            audio.play()
            audio.pause()
            this.setData({
                duration: audio.duration
            })
            this.data.audio.seek(0)
            this.data.audio.currentTime = 0
            this.data.currentTime = 0
            console.log(audio)
            this.data.interval = setInterval(() => {
                this.audioUpdate(this)
            }, 1000);
            audio.onEnded( () =>{
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
        this.data.audio.play()
        this.data.audio.pause()
        let value = parseInt(e.detail.value * this.data.audio.duration / 100)
        this.setData({
            'currentTime': value,
            'currentPercent': value * 100 / this.data.audio.duration
        })
        console.log('duration:' + this.data.audio.duration)
        console.log('SilderChange, seekIndex:' + e.detail.value * this.data.audio.duration / 100)
        this.data.audio.seek(e.detail.value * this.data.audio.duration/ 100)
        this.data.audio.currentTime = e.detail.value * this.data.audio.duration / 100
        this.data.currentTime = e.detail.value * this.data.audio.duration / 100
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
        console.log(this.data.cut)
        console.log(this.data.left * this.data.duration / 100)
        if(this.data.cut){
            this.data.audio.play()
            this.data.audio.pause()
            this.data.audio.seek(this.data.left * this.data.duration / 100)
        }
        console.log(this.data.currentTime)
        this.data.audio.play();
        this.setData({
            play: 1,
            playButtonPic: "../../images/pause.png"
        })
    },
    audioStop() {
        console.log('audioStop')
        this.data.audio.pause()
        this.setData({
            currentTime: 0,
            currentPercent: 0,
            play: 0,
            playButtonPic: "../../images/play.png"
        })
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
        this.audioStop()
    },
    finish(){
        let that = this
        swan.showLoading({
            title:'loading'
        })
        console.log(this.data.duration)
        console.log(this.data.left)
        console.log(this.data.right)
        swan.uploadFile({
            url:  "https://bemusician.uniquestudio.orange233.top/music/cut",
            filePath: this.data.link,
            name: 'myfile',
            formData: {
                startTime: parseInt(this.data.left  * this.data.duration * 10),
                endTime: parseInt(this.data.right * this.data.duration * 10)
            },
            success: res =>{
                console.log('uploadsuccess:' + res.statusCode)
                console.log(res.data.data)
                if(res.statusCode == 200){
                    swan.downloadFile({
                        url: 'https://bemusician.uniquestudio.orange233.top/music/cut/' + res.data.data,
                        success: res =>{
                            that.setData({
                                'link': res.tempFilePath
                            })
                            that.audioInit()
                            swan.hideLoading()
                            that.save()
                        },
                        fail: res =>{
                            swan.showToast({
                                title: '剪辑失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            }
        });
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
                this.data.record[0].ispermanent = true
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
        console.log(`app.globalData.record: ${app.globalData.record}`)
        swan.navigateBack()
    },
    leftchange(e){
        this.setData({
            left : e.detail.value
        })
        console.log(`left${this.data.left}\nright${this.data.right}`)
        if(this.data.left > this.data.right - 1 / this.data.audio.duration * 100)
            this.setData({
                left: this.data.right - 1 / this.data.audio.duration * 100
            })
    },
    rightchange(e){
        this.setData({
            right : e.detail.value
        })
        console.log(`left${this.data.left}\nright${this.data.right}`)
        if(this.data.right < this.data.left + 1 / this.data.audio.duration * 100)
            this.setData({
                right: this.data.left + 1 / this.data.audio.duration * 100
            })
    }
});