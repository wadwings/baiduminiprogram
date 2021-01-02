const app = getApp();
const key = 'key'
const firstLaunch = 'firstLaunch'
Page({
    data: {
        'music': "Inception",
        'start': 0,
        'audioSources': [],
        'cdn': "https://unique-baiduprogram.cdn.bcebos.com/",
        'extention': ".mp3",
        'audioFilePath': [],
        'value': '',
        "status": "录制",
        "arrow": "../../images/down.png",
        'list': [{
            'name': 'Limitless',
            "extention": '.mp3'
        }, {
            'name': 'AndroidPorn',
            "extention": '.mp3'
        }, {
            'name': 'Inception',
            'extention': '.mp3'
        }, {
            'name': 'Ascension',
            'extention': '.mp3'
        }, {
            'name': 'fairy tail',
            'extention': '.mp3'
        }, {
            'name': '三叶',
            'extention': '.mp3'
        }, {
            'name': 'Animals',
            'extention': '.mp3'
        }],
        'select': 0,
        'record': {
            'startTime': null,
            'endTime': null,
            'record': [],
            'music': null,
        },
        'timeout': [],
        'timeoout': [],
        'hover': [null, ''],
        'recordTime': "00:00",
        'minute': 0,
        'second': 0,
        'audio': [],
        'color': 'grey',
        'reminder': 0,
        'background': "background2",
        'hover1': 'hoverKey',
        'hover2': 'hoverKey',
        'btn': 'btn',
    },
    onLoad: function () {
        swan.getStorageInfo({
            success: res => {
                console.log(res.keys)
                if(res.keys.indexOf("firstLaunch") == -1){
                    this.setData({
                        'reminder': 1
                    })
                    console.log("show reminder")
                    swan.setStorage({
                        key: firstLaunch,
                        data: 1
                    })
                }
            }
        })
        swan.getStorage({
            key,
            success: res => {
                console.log('缓存获取成功')
                app.globalData.record = res.data;
                console.log(app.globalData.record)
                console.log(app.globalData.record.length)
                if(app.globalData.record.length)
                    this.setData({
                        color: 'black'
                    })
            },
            fail: () => {
                console.log('缓存获取失败')
            },
            complete: () => console.log('获取完成')
        })
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
        this.loadAudioFile();
        //swan.navigateTo({
        //     url: '../music/index'
        // })
//        监听页面加载的生命周期函数
    },
    onReady: function () {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function () {
        // 监听页面显示的生命周期函数
        if(app.globalData.record.length){
            console.log('black')
            this.setData({
                color: 'black'
            })
        }else{
            console.log('grey')
            this.setData({
                color: 'grey'
            })
        }

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
                let temp = res.tempFilePath
                console.log("record stop")
                console.log(that.data.record.record)
                swan.showLoading({
                    title: 'Loading...'
                });
                swan.request({
                    // 开发者服务器接口地址
                    url:  "https://bemusician.uniquestudio.orange233.top/music/merge",
                    // 请求的参数
                    data: that.data.record.record,
                    // 设置请求的 header，header 中不能设置 Referer。
                    header: {
                    },
                    // 有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE 。
                    method: 'POST',
                    // 有效值：string,json。 如果设为 json，会尝试对返回的数据做一次 JSON.parse 。
                    dataType: 'json',
                    // 设置响应的数据类型, 合法值：text、arraybuffer。
                    responseType: 'text',
                    // 收到开发者服务成功返回的回调函数。
                    success: res => {
                        console.log(res)
                        if(res.statusCode == 200){
                            swan.downloadFile({
                                url: `https://bemusician.uniquestudio.orange233.top/music/merge/${res.data.data}`,
                                success: res=>{
                                    console.log(res.tempFilePath)
                                    app.globalData.temp = {
                                        link: res.tempFilePath,
                                        music: that.data.music,
                                        value: null
                                    };
                                    console.log(app.globalData.temp)
                                    swan.navigateTo({
                                        url: '../product/product'
                                    })
                                },
                                complete:()=>{
                                    swan.hideLoading()
                                }
                            })
                        }
                        else{
                            swan.hideLoading()
                            swan.showToast({
                                icon:'none',
                                title: '请点击按键才有音乐哦'
                            });
                        }
                    },
                    // 接口调用失败的回调函数。
                    fail: res => {
                        app.globalData.temp = {
                            link: temp,
                            music: that.data.music,
                            value: null
                        };
                        console.log(app.globalData.temp)
                        swan.navigateTo({
                            url: '../product/product'
                        })
                    },
                    // 接口调用结束的回调函数（调用成功、失败都会执行）。
                    complete: res => {
                    }
                });
            }

        )
    },
    recorderManagerUpdate(that) {
        that.data.second++
        if (that.data.second == 60) {
            that.data.minute++
            that.data.second = 0
        }
        if (that.data.second < 10) {
            if (that.data.minute < 10)
                that.setData({
                    recordTime: '0' + that.data.minute + ':' + '0' + that.data.second
                })
            else
                that.setData({
                    recordTime: that.data.minute + ':' + '0' + that.data.second
                })
        } else {
            if (that.data.minute < 10)
                that.setData({
                    recordTime: '0' + that.data.minute + ':' + that.data.second
                })
            else
                that.setData({
                    recordTime: that.data.minute + ':' + that.data.second
                })
        }
    },
    recorderManagerStart() {
        if(this.data.select)
            return;
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
            status: "完成",
            start: 1
        })
        this.data.interval = setInterval(() => {
            this.recorderManagerUpdate(this)
        }, 1000);
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
            second: 0,
            minute: 0,
            recordTime: '00:00'
        })
    },
    navigateTo(e) {
        if(!this.data.start&&app.globalData.record.length)
        swan.navigateTo({
            url: '../collection/collection'
        })
        else{
            swan.showToast({
                icon: 'none',
                title: '暂无作品，请先进行创作'
            })
        }
    },
    loadAudioFile() {
        console.log(this.data.audio)
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
                    this.data.audio[i] = swan.createInnerAudioContext()
                    this.data.audio[i].src = res.tempFilePath
                    this.data.audio[i].onError(err => {
                        for(let i = 1 ; i < this.data.audio.length;i++){
                            this.data.audio[i].offError()
                        }
                        swan.showModal({
                            title: '错误',
                            content: '数据异常，请手动重启小程序'
                        })
                        console.log('onError', err);
                    })
                    console.log(res.tempFilePath);
                    console.log(this.data.audio[i])
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
    play(e){
        console.log(e.currentTarget)
        this.data.record.record.push({
            name: this.data.music + '_chip' + e.currentTarget.dataset.src + '.mp3',
            time: Date.now() - this.data.record.startTime
        })
        this.data.audio[parseInt(e.currentTarget.dataset.src)].play();
        if (this.data.timeout[parseInt(e.currentTarget.dataset.src)]) {
            clearTimeout(this.data.timeout[parseInt(e.currentTarget.dataset.src)])
            clearTimeout(this.data.timeoout[parseInt(e.currentTarget.dataset.src)])
            let hover = this.data.hover
            hover[parseInt(e.currentTarget.dataset.src)] = 'blackKey'
            this.setData({
                hover : hover
            })
        }
        this.data.timeout[parseInt(e.currentTarget.dataset.src)] = setTimeout(() => {
            let hover = this.data.hover
            hover[parseInt(e.currentTarget.dataset.src)] = ''
            this.setData({
                hover : hover
            })
        }, 1000);
        this.data.timeoout[parseInt(e.currentTarget.dataset.src)] = setTimeout(() => {
            this.data.timeout[parseInt(e.currentTarget.dataset.src)] = 0
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
    },
    close(){
        this.setData({
            reminder: 0
        })
    },
    changeTheme(){
        if(this.data.background == 'background2'){
            this.setData({
                background: 'background1',
                hover1: 'hoverKey2',
                hover2: 'hoverKey3',
                btn: 'btn2'
            })
        }else{
            this.setData({
                background: 'background2',
                hover1: 'hoverKey',
                hover2: 'hoverKey',
                btn: 'btn'
            })
        }
    },
    instruction(){
        this.setData({
            reminder:1
        })
    }
});