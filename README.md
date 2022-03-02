# fortissimo

前端库

各个包的用法请参考各自的README.md

### 开发语言
本项目使用typescript编写

### 项目依赖的node版本
由于编译包用到了es6 modules的特性和顶级await，最低要求v16+，版本越高越好

### 项目依赖的全局库

本项目依赖部分全局库的支持，开发前需先安装

#### 1. typescript
   用来编译代码，typescript版本要求v4.0+，若未安装或版本不正确需全局安装typescript
```shell
sudo npm i -g typescript
```

#### 2. conventional-changelog-cli
用来生成changelog，conventional-changelog-cli版本要求v2.1+，若未安装或版本不正确需全局安装conventional-changelog-cli
```shell
sudo npm i -g conventional-changelog-cli
```

#### 3. commitizen
用来生成规范git提交，commitizen版本要求v4.2+，若未安装或版本不正确需全局安装commitizen
```shell
sudo npm i -g commitizen
```

### 项目初始化
1. 按照上述说明安装全局依赖库
2. 在代码目录安装依赖
```shell
npm i
```

### 包初始化
1. 进入包目录：packages/包名称
```shell
cd packages/包名称
```  
2. 在包代码目录安装依赖
```shell
npm i
```

### 包编译说明
1. 在代码目录下执行脚本
```shell
npm run build
```
2. 根据提示完成命令行操作
3. 在对于的包目录下dist文件夹中为打包后的内容

### 新包开发说明
1. 在代码目录下执行脚本
```shell
npm run new
```
2. 根据提示完成命令行操作
3. src目录用来存放源代码，type目录用于存放声明文件
4. 根据项目需要修改package.json和README.md
5. 在src目录中开始编码

### 代码提交说明
1. 在代码目录下执行脚本
```shell
npm run commit
```
或者
```shell
npm run commit-all
```
前者用于提交包代码，在包修改后提交代码时使用；后者用于提交所有代码，在多个包修改时或者外层代码修改时使用
2. 根据提示完成命令行操作

### 包发布说明
1. 在代码目录下执行脚本
```shell
npm run release
```
2. 根据提示完成命令行操作

### 参考
版本号规范：https://semver.org/lang/zh-CN/
