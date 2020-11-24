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
        "status": "录制",
        "arrow": "../../images/down.png",
        'list': [{
            'name': 'Limitless',
            "extention": '.mp3'
        }, {
            'name': 'AndroidPorn',
            "extention": '.wav'
        }, {
            'name': 'Inception',
            'extention': '.mp3'
        }],
        'select': 0,
        'record': {
            'startTime': null,
            'endTime': null,
            'record': [],
            'music': null,
        },
        'timeout':[],
        'timeoout':[],
        'hover':[null,''],
        'recordTime':"00:00",
        'minute': 0,
        'second': 0
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
    recorderManagerInit(that) {
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
            function (res) {
                console.log("record stop")
                app.globalData.recorderHistorylink.push(res.tempFilePath);
                app.globalData.recorderHistoryMusic.push(that.data.music);
            }
        )
    },
    recorderManagerUpdate(that){
        that.data.second++
        if(that.data.second == 60){
            that.data.minute++
            that.data.second = 0
        }
        if(that.data.second < 10){
            if(that.data.minute < 10)
                that.setData({
                    recordTime : '0' + that.data.minute + ':' + '0' + that.data.second
                })
            else
                that.setData({
                    recordTime : that.data.minute + ':' + '0' + that.data.second
                })
        }else{
            if(that.data.minute < 10)
            that.setData({
                recordTime : '0' + that.data.minute + ':' + that.data.second
            })
        else
            that.setData({
                recordTime : that.data.minute + ':' + that.data.second
            })
        }
    },
    recorderManagerStart() {
        this.data.record.startTime = Date.now()
        this.data.record.music = this.data.music
        this.data.record.record = []
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
        this.data.interval = setInterval(() =>{this.recorderManagerUpdate(this)}, 1000);
    },
    recorderManagerStop() {
        this.data.record.endTime = Date.now()
        this.recorderManager.stop();
        this.setData({
            start: 0,
            status: "录制"
        })
        console.log(this.data.record)
        clearInterval(this.data.interval)
        this.setData({
            second : 0,
            minute : 0,
            recordTime : '00:00'
        })

    },
    navigateTo(e) {
        swan.navigateTo({
            url: '../collection/collection'
        })
    },
    loadAudioFile() {
        swan.showLoading({
            title: 'Loading...'
        });
        this.data.audioFilePath = []
        let count = 0
        for (let i = 1; i < 19; i++)
            swan.downloadFile({
                url: this.data.cdn + this.data.music + '/' + this.data.music + '_chip' + i + this.data.extention,
                success: res => {
                    this.data.audioFilePath[i] = res.tempFilePath;
                    console.log(res.tempFilePath);
                    count++
                    if (count == 18)
                        swan.hideLoading()
                },
                fail: err => {
                    this.toast('下载文件失败');
                    console.log('错误码: ' + err.errCode);
                    console.log('错误信息: ' + err.errMsg);
                }
            })

    },
    play1(e) {
        this.data.record.record.push({
            name: this.data.music + '_chip1.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[1];
        inneraudiocontext.play();
        if(this.data.timeout[1]){
            clearTimeout(this.data.timeout[1])
            clearTimeout(this.data.timeoout[1])
            this.setData({
                hover1 : 'blackKey'
            })
        }
        this.data.timeout[1] = setTimeout( () =>{
            this.setData({
                hover1 : ''
            })
        }, 1000);
        this.data.timeoout[1] = setTimeout(()=>{
            this.data.timeout[1] = 0
        }, 5000)
    },
    play2() {
        this.data.record.record.push({
            name: this.data.music + '_chip2.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[2];
        inneraudiocontext.play();
        if(this.data.timeout[2]){
            clearTimeout(this.data.timeout[2])
            clearTimeout(this.data.timeoout[2])
            this.setData({
                hover2 : 'blackKey'
            })
        }
        this.data.timeout[2] = setTimeout( () =>{
            this.setData({
                hover2 : ''
            })
        }, 1000);
        this.data.timeoout[2] = setTimeout(()=>{
            this.data.timeout[2] = 0
        }, 5000)
    },
    play3() {
        this.data.record.record.push({
            name: this.data.music + '_chip3.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[3];
        inneraudiocontext.play();
        if(this.data.timeout[3]){
            clearTimeout(this.data.timeout[3])
            clearTimeout(this.data.timeoout[3])
            this.setData({
                hover3 : 'blackKey'
            })
        }
        this.data.timeout[3] = setTimeout( () =>{
            this.setData({
                hover3 : ''
            })
        }, 1000);
        this.data.timeoout[3] = setTimeout(()=>{
            this.data.timeout[3] = 0
        }, 5000)

    },
    play4() {
        this.data.record.record.push({
            name: this.data.music + '_chip4.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[4];
        inneraudiocontext.play();
        if(this.data.timeout[4]){
            clearTimeout(this.data.timeout[4])
            clearTimeout(this.data.timeoout[4])
            this.setData({
                hover4 : 'blackKey'
            })
        }
        this.data.timeout[4] = setTimeout( () =>{
            this.setData({
                hover4 : ''
            })
        }, 1000);
        this.data.timeoout[4] = setTimeout(()=>{
            this.data.timeout[4] = 0
        }, 5000)
    },
    play5() {
        this.data.record.record.push({
            name: this.data.music + '_chip5.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[5];
        inneraudiocontext.play();
        if(this.data.timeout[5]){
            clearTimeout(this.data.timeout[5])
            clearTimeout(this.data.timeoout[5])
            this.setData({
                hover5 : 'blackKey'
            })
        }
        this.data.timeout[5] = setTimeout( () =>{
            this.setData({
                hover5 : ''
            })
        }, 1000);
        this.data.timeoout[5] = setTimeout(()=>{
            this.data.timeout[5] = 0
        }, 5000)
    },
    play6() {
        this.data.record.record.push({
            name: this.data.music + '_chip6.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[6];
        inneraudiocontext.play();
        if(this.data.timeout[6]){
            clearTimeout(this.data.timeout[6])
            clearTimeout(this.data.timeoout[6])
            this.setData({
                hover6 : 'blackKey'
            })
        }
        this.data.timeout[6] = setTimeout( () =>{
            this.setData({
                hover6 : ''
            })
        }, 1000);
        this.data.timeoout[6] = setTimeout(()=>{
            this.data.timeout[6] = 0
        }, 5000)
    },
    play7() {
        this.data.record.record.push({
            name: this.data.music + '_chip7.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[7];
        inneraudiocontext.play();
        if(this.data.timeout[7]){
            clearTimeout(this.data.timeout[7])
            clearTimeout(this.data.timeoout[7])
            this.setData({
                hover7 : 'blackKey'
            })
        }
        this.data.timeout[7] = setTimeout( () =>{
            this.setData({
                hover7 : ''
            })
        }, 1000);
        this.data.timeoout[7] = setTimeout(()=>{
            this.data.timeout[7] = 0
        }, 5000)
    },
    play8() {
        this.data.record.record.push({
            name: this.data.music + '_chip8.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[8];
        inneraudiocontext.play();
        if(this.data.timeout[8]){
            clearTimeout(this.data.timeout[8])
            clearTimeout(this.data.timeoout[8])
            this.setData({
                hover8 : 'blackKey'
            })
        }
        this.data.timeout[8] = setTimeout( () =>{
            this.setData({
                hover8 : ''
            })
        }, 1000);
        this.data.timeoout[8] = setTimeout(()=>{
            this.data.timeout[8] = 0
        }, 5000)
    },
    play9() {
        this.data.record.record.push({
            name: this.data.music + '_chip9.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[9];
        inneraudiocontext.play();
        if(this.data.timeout[9]){
            clearTimeout(this.data.timeout[9])
            clearTimeout(this.data.timeoout[9])
            this.setData({
                hover9 : 'blackKey'
            })
        }
        this.data.timeout[9] = setTimeout( () =>{
            this.setData({
                hover9 : ''
            })
        }, 1000);
        this.data.timeoout[9] = setTimeout(()=>{
            this.data.timeout[9] = 0
        }, 5000)
    },
    play10() {
        this.data.record.record.push({
            name: this.data.music + '_chip10.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[10];
        inneraudiocontext.play();
        if(this.data.timeout[10]){
            clearTimeout(this.data.timeout[10])
            clearTimeout(this.data.timeoout[10])
            this.setData({
                hover10 : 'blackKey'
            })
        }
        this.data.timeout[10] = setTimeout( () =>{
            this.setData({
                hover10 : ''
            })
        }, 1000);
        this.data.timeoout[10] = setTimeout(()=>{
            this.data.timeout[10] = 0
        }, 5000)
    },
    play11() {
        this.data.record.record.push({
            name: this.data.music + '_chip11.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[11];
        inneraudiocontext.play();
        if(this.data.timeout[11]){
            clearTimeout(this.data.timeout[11])
            clearTimeout(this.data.timeoout[11])
            this.setData({
                hover11 : 'blackKey'
            })
        }
        this.data.timeout[11] = setTimeout( () =>{
            this.setData({
                hover11 : ''
            })
        }, 1000);
        this.data.timeoout[11] = setTimeout(()=>{
            this.data.timeout[11] = 0
        }, 5000)
    },
    play12() {
        this.data.record.record.push({
            name: this.data.music + '_chip12.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[12];
        inneraudiocontext.play();
        if(this.data.timeout[12]){
            clearTimeout(this.data.timeout[12])
            clearTimeout(this.data.timeoout[12])
            this.setData({
                hover12 : 'blackKey'
            })
        }
        this.data.timeout[12] = setTimeout( () =>{
            this.setData({
                hover12 : ''
            })
        }, 1000);
        this.data.timeoout[12] = setTimeout(()=>{
            this.data.timeout[12] = 0
        }, 5000)
    },
    play13() {
        this.data.record.record.push({
            name: this.data.music + '_chip13.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[13];
        inneraudiocontext.play();
        if(this.data.timeout[13]){
            clearTimeout(this.data.timeout[13])
            clearTimeout(this.data.timeoout[13])
            this.setData({
                hover13 : 'blackKey'
            })
        }
        this.data.timeout[13] = setTimeout( () =>{
            this.setData({
                hover13 : ''
            })
        }, 1000);
        this.data.timeoout[13] = setTimeout(()=>{
            this.data.timeout[13] = 0
        }, 5000)
    },
    play14() {
        this.data.record.record.push({
            name: this.data.music + '_chip14.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[14];
        inneraudiocontext.play();
        if(this.data.timeout[14]){
            clearTimeout(this.data.timeout[14])
            clearTimeout(this.data.timeoout[14])
            this.setData({
                hover14 : 'blackKey'
            })
        }
        this.data.timeout[14] = setTimeout( () =>{
            this.setData({
                hover14 : ''
            })
        }, 1000);
        this.data.timeoout[14] = setTimeout(()=>{
            this.data.timeout[14] = 0
        }, 5000)
    },
    play15() {
        this.data.record.record.push({
            name: this.data.music + '_chip15.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[15];
        inneraudiocontext.play();
        if(this.data.timeout[15]){
            clearTimeout(this.data.timeout[15])
            clearTimeout(this.data.timeoout[15])
            this.setData({
                hover15 : 'blackKey'
            })
        }
        this.data.timeout[15] = setTimeout( () =>{
            this.setData({
                hover15 : ''
            })
        }, 1000);
        this.data.timeoout[15] = setTimeout(()=>{
            this.data.timeout[15] = 0
        }, 5000)
    },
    play16() {
        this.data.record.record.push({
            name: this.data.music + '_chip16.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[16];
        inneraudiocontext.play();
        if(this.data.timeout[16]){
            clearTimeout(this.data.timeout[16])
            clearTimeout(this.data.timeoout[16])
            this.setData({
                hover16 : 'blackKey'
            })
        }
        this.data.timeout[16] = setTimeout( () =>{
            this.setData({
                hover16 : ''
            })
        }, 1000);
        this.data.timeoout[16] = setTimeout(()=>{
            this.data.timeout[16] = 0
        }, 5000)
    },
    play17(e) {
        this.data.record.record.push({
            name: this.data.music + '_chip17.mp3',
            time: Date.now() - this.data.record.startTime
        })
        console.log(e)
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[17];
        inneraudiocontext.play();
        if(this.data.timeout[17]){
            clearTimeout(this.data.timeout[17])
            clearTimeout(this.data.timeoout[17])
            this.setData({
                hover17 : 'blackKey'
            })
        }
        this.data.timeout[17] = setTimeout( () =>{
            this.setData({
                hover17 : ''
            })
        }, 1000);
        setTimeout();
        this.data.timeoout[17] = setTimeout(()=>{
            this.data.timeout[17] = 0
        }, 5000)
    },
    play18() {
        this.data.record.record.push({
            name: this.data.music + '_chip18.mp3',
            time: Date.now() - this.data.record.startTime
        })
        let inneraudiocontext = swan.createInnerAudioContext();
        inneraudiocontext.src = this.data.audioFilePath[18];
        inneraudiocontext.play();
        if(this.data.timeout[18]){
            clearTimeout(this.data.timeout[18])
            clearTimeout(this.data.timeoout[18])
            this.setData({
                hover18 : 'blackKey'
            })
        }
        this.data.timeout[18] = setTimeout( () =>{
            this.setData({
                hover18 : ''
            })
        }, 1000);
        this.data.timeoout[18] = setTimeout(()=>{
            this.data.timeout[18] = 0
        }, 5000)
    },
    selectMusic() {
        if (!this.data.select) {
            this.setData({
                arrow: "../../images/up.png",
                select: 1
            })
        } else {
            this.setData({
                arrow: "../../images/down.png",
                select: 0
            })
        }
    },
    ChangeMusic(e) {
        this.setData({
            music: e.currentTarget.dataset.music,
            extention: e.currentTarget.dataset.extention
        })
        setTimeout(this.loadAudioFile(), 1000);
        this.selectMusic();
    }
});