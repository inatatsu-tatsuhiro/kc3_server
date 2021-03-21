# サーバー仕様
- アドレス : hack.inatatsu.com:8000
## 使用技術
- Deno
- TypeScript
- WebSocket
# 仕様
## ドアホン -> サーバー
### 来客が来たとき
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '0'
}
```
### 来客が友人
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '1'
}
```
### 来客が宅配
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '1'
}
```
#### 置き配可能
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '1'
}
```
#### 置き配不可能
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '2'
}
```

### 来客がNHK
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '3'
}
```

### 来客が勧誘
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '4'
}
```
### 来客がウーバー等
```
{
  "method": 'PROXY',
  "from": 'DOOR',
  "select": '5'
}
```

## サーバー -> ドアホン
### 来客が来たとき
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": null,
  "message": '訪問者確認'
}
```
### 来客が友人
```
{
  "method": 'PROXY',
  "target": 'BOTH',
  "visitor": '友人',
  "message": '在宅確認'
}
```
### 来客が宅配
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": '宅配',
  "message": '置き配確認'
}
```
#### 置き配可能
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": '宅配',
  "message": '置き配'
}
```
#### 置き配不可能
```
{
  "method": 'PROXY',
  "target": 'BOTH',
  "visitor": '宅配',
  "message": '在宅確認'
}
```

### 来客がNHK
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": 'NHK',
  "message": '撃退'
}
```

### 来客が勧誘
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": '勧誘',
  "select": '撃退'
}
```

### 在宅確認したときに在宅の場合
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": null,
  "message": 'OK',
}
```

### 不在の場合
```
{
  "method": 'PROXY',
  "target": 'DOOR',
  "visitor": null,
  "message": 'NG',
}
```

## サーバー -> アプリ

### 在宅確認
友人の場合
```
{
  "method": 'PROXY',
  "target": 'BOTH',
  "visitor": '友人',
  "message": '在宅確認'
}
```
宅配の場合
```
{
  "method": 'PROXY',
  "target": 'BOTH',
  "visitor": '宅配',
  "message": '在宅確認'
}
```
### サイレン
```
{
  "method": 'PROXY',
  "target": 'APP',
  "message": 'サイレン'
}
```

## アプリ -> サーバー

### 在宅
```
{
  "method": 'PROXY',
  "from": 'APP',
  "select": '1'
}
```
### 不在
```
{
  "method": 'PROXY',
  "from": 'APP',
  "select": '2'
}
```