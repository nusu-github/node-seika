# node-seika

> [AssistantSeika](https://hgotoh.jp/wiki/doku.php/documents/voiceroid/assistantseika/assistantseika-000)([@k896951](https://twitter.com/k896951)
> 様制作)の非公式ラッパーライブラリ (Node.js版)

## インストール方法

本ライブラリーは[ECMAScript Modules](https://nodejs.org/api/esm.html)です。

```shell
npm install nusu-github/node-seika
```

## 使い方

```javascript
import NodeSeika from "node-seika"

const client = new Seikasay2("./SeikaSay2.exe")

const client = new Wcfclient("./WCFClient.dll")

const client = new Http("http://localhost:7180/", "SeikaServerUser", "SeikaServerPassword",)

// 全ての関数は非同期関数です。呼び出しにはawaitを必ずつけてください。
const ver = await client.Version()
console.log(ver)
```

### 対応アクセス方法

- WCFClient
    - WCFClient.dllを使用
    - node-seikaのデフォルト
    - メリット
        - 実行が早い
        - CPU使用率が低い
    - デメリット
        - 初期化が遅い


- SeikaSay2
    - SeikaSay2.exeを使用
    - メリット
        - 初期化が早い
        - ほぼ確実に実行できる
    - デメリット
        - CPU使用率が高い


- HTTP
    - HTTP機能を使用
    - メリット
        - 依存ライブラリが無い (exeやdllを必要としない)
        - CPU使用率が低い
        - 実行が早い
    - デメリット
        - 一度に多くのリクエストでタイムアウトする
        - ほかの方法に比べて操作が多い

## 使用ライブラリ

- [AssistantSeika](https://hgotoh.jp/wiki/doku.php/documents/voiceroid/assistantseika/assistantseika-000)
