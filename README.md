gulp-mock-env
========
##Usage

クローン後、作業ディレクトリに移動
```
git clone https://github.com/morinpic/gulp-mock-env.git
cd gulp-mock-env
```

gulpをグローバルへインストール
```
npm install -g gulp
```

依存関係モジュールをインストール
```
npm install
```

開発サーバ起動
-------
```
gulp server
```
- ejsのコンパイル
- scssファイルのコンパイル
- spritesの生成


ビルド
-----
```
gulp build
```
- jsの結合
- jsのminify
- cssのminify
- 画像の圧縮
