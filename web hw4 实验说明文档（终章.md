# web hw4 实验说明文档（终章

## 0. 关于项目

- 这是一个基于nodejs express框架实现的南哪儿猫猫社区平台，基于四次作业不断迭代，才有了最终版。主要实现的功能有平台登录注册，高清猫猫大图瀑布流展示，图片详情查看，图片各类操作，图片水印添加。并且还有想实现的模块未能实现（逃。数据库采用Mongo DB，前后端交互使用了ajax异步请求，页面交互采用js事件处理（dom2事件流处理）。主要开发目的是想为校园里每天勤于拍摄猫猫美照的uu们提供一个交流的平台hhh。

![image-20220110211225208](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110211225208.png)

- bin是express项目入口
- dist存放打包文件
- node_modules存放需要的模块
- public公共资源文件夹，存放网页的js，css，图片等
- routes设置路由
- saved_model_style_inception_js四个文件夹，用于图像风格迁移神经网络的训练models
- utils前后端，数据库接口定义
- views存放html页面
- app.js程序起始js文件，定义加载模块等
- links.js是main.js要加载的一些链接
- main.js是打包用作初始化图片风格迁移
- package.json：依赖包，执行脚本等
- yarn.lock：yarn生成文件，管理包资源

## 1. 实验目标

- 实现浏览器端图片各种处理手段
- 实现多组图片滤镜
- 实现图片裁剪，放大，缩小，缩放，旋转等基本操作。
- 实现图像风格迁移

## 2. 实验环境说明

- 本实验在hw3的基础上迭代开发完成
- 本实验包管理工具从npm换为yarn，防止npm无脑出错
- 本实验所用到的js图像处理库有：lena.js，camanJS，cropper.js
- 本实验图像风格迁移基于TensorFlow.js实现
- nodejs，express
- webpack打包工具
- mongoDB
- VSCode
- chrome

## 3. 运行操作流程

- 终端打开本实验文件夹根目录下运行

```
yarn install
```

- 接着运行

```
yarn run start
```

- 然后在浏览器中输入127.0.0.1:3000/，即可打开项目登录页面。（注意检查数据库是否连接正常，运行后会有相关提示）

![image-20220110153858527](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110153858527.png)

- 通过注册输入，登录到主页

![image-20220110153938907](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110153938907.png)

- 任意点击一张图片进入详情页面

![image-20220110154024900](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154024900.png)



- 此页面下，可以选择第一组滤镜

![image-20220110154105124](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154105124.png)

几个例子：

![image-20220110154434322](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154434322.png)

![image-20220110154342260](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154342260.png)

![image-20220110154356580](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154356580.png)

- 点击更多滤镜与调节，进入下一级页面

![image-20220110154139852](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154139852.png)

- 此页面为第二组滤镜，并且可以对图片的亮度，饱和度，对比度，棕褐度进行细粒度调节，同时提供了下载功能。
- 注意，每个蓝色按钮和橙色按钮设置了点击记忆功能，多次点击可以使得滤镜力度加大

几个例子：

![image-20220110154600372](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154600372.png)

![image-20220110154305058](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154305058.png)

![image-20220110154639667](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110154639667.png)

- 点击save image可以保存
- 点击裁剪与旋转...进入下一级页面：

![image-20220110214823524](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110214823524.png)

- 用户可自定义输入纵横比，像素比，x，y坐标（图片左上角点）
- 可指定纵横比，模式，调整toggle options
- 可放大缩小裁剪旋转（45°）等操作图像
- 可以获得当前canvas，container，crop box数据。
- 可以重置，上传自己的图像进行处理。

例子：

![image-20220110215258718](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110215258718.png)

![image-20220110215323176](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110215323176.png)



## 4. 实验过程详述

### 4.1 使用lena.js实现第一组滤镜

- 在display.html中添加滤镜选项，在图片详情页面实现第一组滤镜。jena.js主要是通过一个img，一个canvas来实现。lena.js有一个filter数组，指定滤镜名就可以添加。![image-20220110171643655](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110171643655.png)

- 这里引入lena模块，但是很遗憾，其线上版本似乎出了点问题，404了，因此这里直接使用源文件lena.min.js，并引入display.html。![image-20220110171912474](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110171912474.png)

- 对于label中的每个option，都加上监听器，用于修改画布cavas。
- 这里调用lena封装好的方法filterImage。![image-20220110172213248](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110172213248.png)

- 最终实现的是通过选择具体滤镜即时更新，画在一张新的画布上。

### 4.2 使用camanJS实现第二组滤镜和各种度调节

- 创建caman.html，这里主要使用的控件是button和label，然后通过查看caman官网，选择滤镜和调节效果进行命名，供js代码通过dom来获取并且响应。
- 首先，加载img的时候动态根据用户点击情况进行加载，先在画布上把原图绘制出来，然后根据用户操作进行重绘。![image-20220110173356915](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110173356915.png)

- 对于亮度，对比度等渐变效果要求较强的，提供了细粒度的调节，分别设置如下的初值和调节范围（通过label拖动改变）![image-20220110172542423](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110172542423.png)

- 在caman.js文件中设置监听器，一旦调节改变，就通过调用caman的模板方法更新画布。![image-20220110172720447](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110172720447.png)

- 对于滤镜，设置button梯度，每次点击后增加10 noise，以noise滤镜为例，其他类似![image-20220110172927517](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110172927517.png)

- 接下来对每个button都建立一个这样的click处理函数![image-20220110173026316](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110173026316.png)

- 最后实现image的下载功能，直接调用caman的save方法![image-20220110173123805](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110173123805.png)

- 这里的png可以修改为任意需要的图片格式，但是要注意的是，下载完成后，需要手动添加上后缀名，才能用图库等打开，被系统识别成png文件。

### 4.3 使用cropper.js实现图片裁剪等操作

- 在cropper.js中定义画布下x，y坐标，图片宽高参数，可用于用户自己输入进行调整![image-20220110200444338](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110200444338.png)

- 定义裁剪伸缩，上下左右移动按钮![image-20220110200716991](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110200716991.png)

- 其他按钮与此类似，都是通过jQuery添加监听响应事件，在这里不赘述，相应的事件监听函数如下：![image-20220110201037002](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110201037002.png)

- 这里使用了bootstrap的模型来控制html元素，从而实现旋转缩放等

- 在cropper.js中，额外实现了用键盘控制图片移动的功能：![image-20220110200950917](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110200950917.png)

### 4.4 使用TensorFlow.js实现图像风格迁移

#### 4.4.1 实现说明

- 这里实现的是**任意画风**（可以在wikiart.org上随机获取）的迁移，摆脱了每种画风都需要提前训练好一个与之对应的神经网络模型的限制，采用100维向量的画风网络来突破。
- 这里采用了MobileNet-v2模型，是将Inception-v3模型浓缩的版本，从而加快浏览器端加载速度，避免将更多代码发送给浏览器，这样做也有利于客户隐私保护。
- 为使迁移网络更高效，绝大多数的普通卷积层被深度可分离卷积层代替。这使得模型体积降至2.4MB，同时大幅提升了画风渲染速度。
- 画风网络模型9.6MB，可分离卷积迁移网络2.4MB，一共需要下载12MB，即可用于任意画风渲染。

#### 4.4.2 实现原理

- 由于每种画风可通过画风网络转化为一个100维的画风向量，因此可以求两个画风向量的加权平均值，即可得到一个新的画风向量供迁移网络使用。使得画风渲染强度可控，求画风图像向量和内容图像向量的加权平均值，并把结果作为迁移网络的输入。

#### 4.4.3 实现过程

- 实现一种风格迁移到一张图片

- 实现两种风格迁移到一张图片

- 这里通过一个Main类来加载所有需要的方法供渲染使用，在window加载的时候就执行。同时，为了能够在浏览器端运行，将main.js进行打包，这里直接将打包好的文件放在了public/javascripts下，而打包则是通过yarn run prep实现：![image-20220110202653294](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110202653294.png)

- 也可以重新打包，打包后文件默认位于disk文件夹下。（要装webpack）

- 然后在html文件中引入这个打包后的main.js

- html主要控件仍然使用选定框，每次修改选定框可以选择不同的图片。也可以选择上传本地图片或者拍照。

- 拍照功能需要访问用户的摄像头。

- 相关图片大小的调节，也会影响训练模型的结果，因此这里提供了调节图片大小的功能，也可以修改图片尺寸，如正方形渲染等。![image-20220110203158710](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110203158710.png)

- 对应逻辑如下（main.js里）：

- 首先是加载训练的四个model![image-20220110203331646](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110203331646.png)

- 然后是加载图片，初始化按钮，初始化选择器。

  ![image-20220110203446026](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110203446026.png)

- 这里是对于大小调节滑动按钮的实现：

  ![image-20220110203523023](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110203523023.png)

- 迁移风格与结合的函数，具体是对前面模块的调用，将一个图片“画”在另一个图片上，实现风格迁移，将两张图片的100维向量作为输入，进行迁移网络运算得出结果。![image-20220110203804735](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110203804735.png)

- 最后还实现了移动端的响应式布局。![image-20220110203959910](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110203959910.png)

## 5. 相关辅助功能实现

#### 5.1 大量图片按照用户点击进行展示

- 基本思路是使用cookie来实现，通过存储一个图片id值，跳转页面在加载时候从cookie读取id值，决定应该显示哪张图片，然后用dom修改相应的image的src，再进行展示。![image-20220110204353989](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110204353989.png)![image-20220110204429354](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110204429354.png)

- 其中还手动实现了getcookie，但其实jQuery有更加方便的封装方法。。。
- 对于一些cavas相关图片的加载，也采用类似的方式进行软编码。
- 但本质上这不是一个优秀的实现方法，因为用户等待时间加长了，且用户有可能禁用cookie，未来要进行优化，可能的方向有ejs，模板引擎等。

#### 5.2 设置静态资源目录得以加载训练模型

- 因为之前将public设置了路径参数，而express不允许直接访问根目录静态资源，因此这里将静态资源访问添加根路径，加载神经网络训练模型。

![image-20220110205247718](C:\Users\picturesque\AppData\Roaming\Typora\typora-user-images\image-20220110205247718.png)

- 具体的加载函数在main.js中



## 6. 一些小技巧

- jQuery使用： JS是解释型语言，是根据标签引用分块顺序执行的，$是jQuery中的产生的对象，需要用的话，必须将jquery.js文件放在使用它的JS前面。

  因此要将jQuery库放在依赖于jQuery的JavaScript脚本之前，并且将这些代码放入document.ready来确保DOM加载完毕。

- css 3圆角边框嘿嘿





参考资料：

图像风格迁移讲解

https://zhuanlan.zhihu.com/p/55948352

关于图像风格迁移的小demo，学到了很多

https://github.com/reiinakano/arbitrary-image-stylization-tfjs

camanJS讲解

https://www.cnblogs.com/zzsdream/articles/6546930.html

webpack使用

https://webpack.docschina.org/guides/getting-started/#creating-a-bundle

