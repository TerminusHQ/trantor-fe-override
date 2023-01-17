const file = require("./readFile"); // 读取文件
const ProgressBar = require("./progress-bar"); // 进度条
const pb = new ProgressBar("正在上传至阿里云 OSS", 50); // 初始化进度条
const path = require("path");

const OSS = require("ali-oss"); // OSS SDK
let client;
let distURL;

// 文件夹时间戳
const timeStamp = Math.floor(Date.now() / 1000);
const urlRegExp = new RegExp(`\\S+(?=${timeStamp})${timeStamp}\/`);

// 构造上传函数
function uploadFile(key, localFile) {
  return client
    .put(key, localFile)
    .then(function(r1) {
      return client.get(key);
    })
    .then(function(res) {
      const {
        res: { requestUrls },
      } = res;
      distURL = urlRegExp.exec(requestUrls[0])[0];
    })
    .catch(function(err) {
      console.error("error: %j", err);
    });
}

let num = 1;

function uploading(files, uploadType) {
  if (num <= files.length) {
    // 更新进度条
    pb.render({
      completed: num,
      total: files.length,
    });
    // 上传,加入时间戳文件
    const key = `/${timeStamp}/${files[num - 1].fileName}`;
    const filePath = files[num - 1].filePath;
    uploadFile(key, filePath)
      .then(() => {
        num++;
        setTimeout(() => {
          uploading(files);
        }, 200);
      })
      .catch(() => {
        console.error("\n上传失败，请检查 OSS 配置!");
      });
  } else {
    console.log(`\n成功上传 dist 到 OSS!\n对应目录: '${distURL}`);
    if (uploadType === "override") {
      console.log(
        `请在 erda 环境变量中配置 WEBNEST_OVERRIDE=${distURL}trantor.module.json`
      );
    } else {
      console.log(`请在交付控制台配置自定义配置 WEBNEST_THEME=${distURL}webnest.css`)
    }
  }
}

// TODO：这里可以做个适配器，然后上传到aws、七牛等 OSS
function upload(config) {
  const { path: _path, uploadType } = config;
  const distPath = path.join(__dirname, "../", _path);
  const files = file.getFiles(distPath);
  client = new OSS(config);
  uploading(files, uploadType);
}

module.exports = upload;
