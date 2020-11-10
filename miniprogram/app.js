//app.js
App({
  onLaunch: function () {

    if (!swan.cloud) {
      console.error('请使用 3.105.2 或以上的基础库以使用云能力')
    } else {
      swan.cloud.init({
        traceUser: true,
        env: 'wadwings-vy9egag8'
      })
    }

    this.globalData = {}
  }
})
