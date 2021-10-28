<template>
  <div>
    <div v-if="showQrcode" class="qrcode" id="qrcode">
      <div><b>手机扫码</b></div>
    </div>
    <textarea placeholder="发送内容" v-model="ipt" rows="9" class="textarea" ></textarea>
    <div class="action">
      <button @click="send" class="send">发送</button>
      <button @click="sendToCY" class="send">添加到复制区</button>
      <button class="clear" @click="ipt = ''">清除</button>
    </div>
    <h1>复制区</h1>
    <div class="item" @click="copyTxt(item)" v-for="item in list" :key="item">
      {{ item }}
      <span @click.stop="remove(item)" class="remove" >—</span>
    </div>
  </div>
</template>
<script lang="ts">
import copy from 'copy-text-to-clipboard';
import QRCode from 'qrcode'

export default {
  data() {
    return {
      showQrcode: false,
      ipt: '',
      list: []
    }
  },
  mounted () {
    // 生产环境使用服务端的数据
    // if (process.env.NODE_ENV === 'production') {
      this.getList()
    // }
    // 移动端不显示二维码
    if(!(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))) {
      console.log('mobile')
      this.showQrcode = true
      const host = location.origin
      this.$nextTick(() => {
        QRCode.toCanvas(host, { errorCorrectionLevel: 'H', width: 100, height: 100 }, function (err, canvas) {
          if (err) throw err
          var container = document.getElementById('qrcode')
          container.appendChild(canvas)
        })
      })
    }
  },
  methods: {
    getList () {
      fetch('/api/list',{
        method:"get",
        mode: 'cors', // 跨域请求
        headers: {
          'Content-Type': 'application/json'
        }}).then((response) => {
          return response.json()
        }).then(res => {
          console.log(res);
          this.list = res.data || []
        })
    },
    copyTxt (content: string) {
      copy(content)
      this.$notify("复制成功");
    },
    sendToCY () {
      const value = this.ipt
      console.log(value);
      if (!value.trim()) {
        return 
      }
      fetch('/api/add',{
        method:"POST",
        mode: 'cors', // 跨域请求
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content : value
        })
        }).then(() => {
        this.getList()
        this.$notify("发送成功");
      }).catch(() => {
        this.$notify({ title: "发送失败", type: 'error' });
      })
    },
    // 移除复制区内容
    remove (value) {
      fetch('/api/data',{
        method:"delete",
        mode: 'cors', // 跨域请求
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: value
        })
        }).then(() => {
        this.getList()
        this.$notify("删除成功");
      }).catch(() => {
        this.$notify({ title: "删除失败", type: 'error' });
      })
    },
    send () {
      const value = this.ipt
      console.log(value);
      if (!value.trim()) {
        return 
      }
      fetch('/api/data',{
        method:"POST",
        mode: 'cors', // 跨域请求
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content : value
        })
        }).then(() => {
  　　}).then(() => {
        this.$notify("发送成功");
      }).catch(() => {
        this.$notify({ title: "发送失败", type: 'error' });
      })
    }
  }
}
</script>

<style lang='less' scoped>
.item {
  padding: 10px;
  font-size: 1.8rem;
  position: relative;
  .remove {
    position: absolute;
    top: 50%;
    right: 20%;
    display: none;
    background: red;
    opacity: 0.7;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    padding: 4px;
    color: #fff;
    transform: translateY(-50%);
    &:hover {
      cursor: pointer;
    }
  }
}
.item:active {
  background: rgba(0, 0, 0, 0.1);
}
.item:hover {
  background: #aaa;
  .remove {
    display: block;
  }
}
.textarea {
  width: 90%;
  box-sizing: border-box;
  border: 1px solid#888;
  border-radius: 4px;
  padding: 4px;
}
input:focus, textarea:focus {
  outline : none ;
}
.action {
  margin-top: 10px;
}
.qrcode {
  position: absolute;
  top: 10px;
  right: 100px;
}
.clear {
  height: 50px;
}
.send {
  height: 50px;
  margin-right: 10px;
}
</style>
