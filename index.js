

// 动画 animate 去管理所有动画函数  遵循单一职责原则
var bird = {
    // 背景x轴初始定位
    skyPosition: 0,
    skyStep: 2,
    birdTop: 220,
    birdStepY: 0,
    startColor: 'blue',
    startFlag: false,
    minTop: 0,
    maxTop: 570,

    // 初始化函数
    init: function () {
        this.initData();
        this.animate();
        this.handle();
    },
//initData
    initData: function () {
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        
    },
    //管理所有动画函数
    animate: function () {
        var self = this,
            count = 0;
        this.timer = setInterval(function(){
            self.skyMove();
            if(self.startFlag) {
                self.birdDrop();
            }
            if(++ count % 10 === 0) {
                if(!self.startFlag) {
                    self.birdJump();
                    self.startBound();
                }
                
                self.birdFly(count);
            }
        },30)
        
        
    },
    //背景运动
    skyMove: function () {

            this.skyPosition -= this.skyStep;
            this.el.style.backgroundPositionX = this.skyPosition + 'px';

    },
    //点击小鸟跳
    birdJump: function() {
            this.birdTop = this.birdTop === 220 ? 260 : 220;
            this.oBird.style.top = this.birdTop + 'px';
    },
    //开始页面小鸟飞
    birdFly: function (count) {
        this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
    },
    //小鸟自由下落
    birdDrop: function () {
       this.birdTop += ++ this.birdStepY;
       this.oBird.style.top = this.birdTop + 'px';
        this.judgeKnock();
    },
    //文字变大变小
    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = prevColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-' + prevColor);
        this.oStart.classList.add('start-' + this.startColor);
    },
    // 碰撞检测
    judgeKnock: function () {
        this.judgeBoundary();
        this.judgePipe();
    },
    // 上下临界值碰撞检测
    judgeBoundary: function () {
        if(this.birdTop < this.minTop || this.birdTop > this.maxTop) {
            this.failGame();
        };
    },
    // 柱子碰撞检测
    judgePipe: function () {},
    // 点击事件
    handle: function (){
        this.handleStart();
        
    },
    // 点击开始游戏
    handleStart: function() {
        self = this;
        this.oStart.onclick = function () {
            self.startFlag = true;
            self.oStart.style.display = 'none';
            self.oScore.style.display = 'block';
            self.oBird.style.left = '80px';
            self.skyStep = 5;
        };
    },
    // 游戏失败
    failGame: function () {
        clearInterval(this.timer);
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
    },
};

bird.init();
