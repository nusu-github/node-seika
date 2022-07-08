# node-seika

> [AssistantSeika](https://hgotoh.jp/wiki/doku.php/documents/voiceroid/assistantseika/assistantseika-000)([@k896951](https://twitter.com/k896951)
> 様制作)の非公式ラッパーライブラリ (Node.js版)

## インストール方法

本ライブラリーは[ECMAScript Modules](https://nodejs.org/api/esm.html)です。

```shell
npm install 
```

## 使い方

exe・dllは再配布禁止の規約に基づき同梱されていません。ダウンロードしてください。

一つ目の引数にパスを指定してください。

```javascript
import NodeSeika from "node-seika"

const client = new NodeSeika({path: "./SeikaSay2.exe"})

// SeikaSay2
const client = new NodeSeika({access_method: "SeikaSay2", path: "./SeikaSay2.exe"})

// WCFClient
const client = new NodeSeika({access_method: "WCFClient", path: "./WCFClient.dll"})

// HTTP
const client = new NodeSeika({
    access_method: "HTTP",
    url: "http://localhost:7180/",
    id: "SeikaServerUser",
    password: "SeikaServerPassword",
})

// 直接アクセス
import {HTTP, SeikaSay2, WCFClient} from "node-seika"

const client = new SeikaSay2("./SeikaSay2.exe")

const client = new WCFClient("./WCFClient.dll")

const client = new HTTP("http://localhost:7180/", "SeikaServerUser", "SeikaServerPassword",)


// 全ての関数は非同期関数です。呼び出しにはawaitを必ずつけてください。
const ver = await client.Version()
console.log(ver)
```

### 対応アクセス方法

- SeikaSay2
    - SeikaSay2.exeを使用したアクセス方法です。
    - メリット
        - 初期化が早い
        - ほぼ確実に実行できる
    - デメリット
        - CPU使用率が高い

- WCFClient
    - WCFClient.dllを使用したアクセス方法です。
    - メリット
        - 実行が早い
        - CPU使用率が低い
        - SeikaSay2よりできることが多い
    - デメリット
        - 依存ライブラリが環境依存
        - 初期化が遅い

- HTTP
    - HTTP機能を使用したアクセス方法です。
    - メリット
        - 依存ライブラリが無い (exeやdllを必要としない)
        - CPU使用率が低い
        - 実行が早い
    - デメリット
        - 一部手動で操作する必要がある
        - 一度に多くのリクエストをするとタイムアウトする

デフォルトはSeikaSay2です。

おすすめはWCFClientです。

## 使用ライブラリ

- [AssistantSeika](https://hgotoh.jp/wiki/doku.php/documents/voiceroid/assistantseika/assistantseika-000)
- [ita-corpus](https://github.com/mmorise/ita-corpus) (読み上げのテスト用に使用しています)