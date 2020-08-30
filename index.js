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
    pipeLength: 7,
    pipeArr: [],
    score: 0,
    pipeLastIndex: 6,
    // scoreArr: [],

    // 初始化函数
    init() {
        this.initData();
        this.animate();
        this.handle();

        if (sessionStorage.getItem('play')) {
            this.start();
        }
    },
    //initData
    initData() {
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.oEnd.getElementsByClassName('final-score')[0];
        this.oRankList = this.oEnd.getElementsByClassName('rank-list')[0];
        this.oRestart = this.oEnd.getElementsByClassName('restart')[0];



        this.scoreArr = this.getScore();

    },
    getScore() {
        var scoreArr = getLocal('score'); //键值不存在 值为null
        return scoreArr ? scoreArr : [];
    },
    //管理所有动画函数
    animate() {
        count = 0;
        this.timer = setInterval(() => {
            // 天空
            this.skyMove();
            // 柱子

            if (this.startFlag) {
                this.birdDrop();
                this.pipeMove();
            }
            if (++count % 10 === 0) {
                if (!this.startFlag) {
                    this.birdJump();
                    this.startBound();
                }

                this.birdFly(count);
            }
        }, 30)


    },
    //背景运动
    skyMove() {

        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';

    },
    //点击小鸟跳
    birdJump() {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + 'px';
    },
    //开始页面小鸟飞
    birdFly(count) {
        this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
    },
    //小鸟自由下落
    birdDrop() {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';
        this.judgeKnock();
        this.addScore();
    },

    // 柱子移动
    pipeMove() {
        for (var i = 0; i < this.pipeLength; i++) {
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skyStep;

            if (x < -52) {
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = lastPipeLeft + 300 + 'px';
                oDownPipe.style.left = lastPipeLeft + 300 + 'px';
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
                continue;
            }
            oUpPipe.style.left = x + 'px';
            oDownPipe.style.left = x + 'px';
        }
    },
    //文字变大变小
    startBound() {
        var prevColor = this.startColor;
        this.startColor = prevColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-' + prevColor);
        this.oStart.classList.add('start-' + this.startColor);
    },
    // 碰撞检测
    judgeKnock() {
        this.judgeBoundary();
        this.judgePipe();
    },
    // 上下临界值碰撞检测
    judgeBoundary() {
        if (this.birdTop < this.minTop || this.birdTop > this.maxTop) {
            this.failGame();
        };
    },
    // 柱子碰撞检测
    judgePipe() {
        //相遇 pipex = 95 离开 pipex = 13
        //柱子高度
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;
        //小鸟高度


        if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
            this.failGame();
        }
    },
    //无碰撞加分
    addScore() {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if (pipeX < 13) {
            this.oScore.innerText = ++this.score;
        }
    },
    // 点击事件
    handle() {
        this.handleStart();
        this.handleClick();
        this.handleRestart();
    },
    // 点击开始游戏
    handleStart() {
        this.oStart.onclick = this.start.bind(this);
    },
    start() {
        this.startFlag = true;
        this.oStart.style.display = 'none';
        this.oBird.style.transition = 'none';
        this.oScore.style.display = 'block';
        this.oBird.style.left = '80px';
        this.skyStep = 5;
        // 柱子之间的宽度
        for (var i = 0; i < this.pipeLength; i++) {
            this.createPipe(300 * (i + 1));

        };
    },
    handleClick() {
        this.el.onclick = (e) => {
            if (!e.target.classList.contains('start')) {
                this.birdStepY = -10;
            };
        };
    },
    // 重新开始
    handleRestart() {
        this.oRestart.onclick = () => {
            sessionStorage.setItem('play', true);
            window.location.reload();

        }
    },

    //创建柱子和高度
    createPipe(x) {
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 - 150 - upHeight;
        // 创建柱子dom 因为要创建多个dom元素耦合率高故封装一个cerateEle()函数生成dom元素，一般放在utils.js文件中。
        // var oDiv = document.createElement('div');
        // oDiv.classList.add('pipe');
        // oDiv.classList.add('pipe-up');
        // oDiv.style.height = upHeight + 'px';
        var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
            'height': upHeight + 'px',
            'left': x + 'px'
        });
        var oDownPipe = createEle('div', ['pipe', 'pipe-bottom'], {
            'height': downHeight + 'px',
            'left': x + 'px'
        });
        // // 将柱子插入父元素
        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);

        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y: [upHeight, upHeight + 150],
        })
    },
    //
    setScore() {
        this.scoreArr.push({
            score: this.score,
            time: this.getDate(),
        });

        //分数排名
        this.scoreArr.sort(function (a, b) {
            return b.score - a.score;
        });

        //
        setLocal('score', this.scoreArr);
    },
    //获取时间
    getDate() {
        var d = new Date();
        var year = d.getFullYear();
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDate());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());

        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
    },
    // 游戏失败
    failGame() {
        clearInterval(this.timer);
        this.setScore();
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = this.score;
        this.renderRankList();
    },
    renderRankList() {
        var template = '';


        for (var i = 0; i < 8; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }
            template += `
            <li class="rank-item">
                <span class="rank-degree ${degreeClass}">${i + 1}</span>
                <span class="rank-score">${this.scoreArr[i].score}</span>
                <span class="rank-time">${this.scoreArr[i].time}</span>
            </li>
        `
        };
        this.oRankList.innerHTML = template;
    },

};

bird.init();