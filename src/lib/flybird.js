"use strict";
exports.__esModule = true;

const MAX_CACHE_NUM = 20;
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;
const STATUS = ['begin', 'gaming', 'poused', 'failed'];
// 用于计算小鸟的速度
let isTouching = false;         // 是否一直点击
let gameStatus = STATUS[0];     // 游戏状态
let horizerSpeed = 1;
const grivity = 0.1;
const flyAccVelocity = -0.2;
let verticalSpeed = 0;

// 用于画图
let ctx;
let canvas;

// 用于缓存，避免重复创建对象
let bird;
let boradsPool = [];
let boradsOnScreen = [];

// 统计过了多少个挡板
let boradCount = 0;

// 组件对象
let gameController;

// 获取小鸟对象
function getBird() {
	if (!bird) {
        bird = {
        	position: { x: canvas.width/3-BIRD_WIDTH/2, y: canvas.height/2-BIRD_HEIGHT/2}, //初始位置为屏幕左1/3,上1/2
        	size: {width:BIRD_WIDTH, height:BIRD_HEIGHT}
        }
	}
	return bird;
}

// 获取挡板
function getBorad() {
	if (boradsPool.length) {
		return boradsPool.pop();
	}
	return {
		leftX: 0,
		cracks:[0, 50],
		width: 40,
        isCounted: false,
	}
}

// 释放挡板
function releaseBorad(borad) {
	if (boradsPool.length < MAX_CACHE_NUM) { //最多缓存20个
		borad.isCounted = false;
		return boradsPool.push(borad);
	}
}

// 一帧内容
function drawFrame() {
    if (Object.is(NaN, ctx) || ctx == null) 
    	return;
    if (gameStatus == STATUS[2]) { // 暂停状态
       return;
    }
    randerGame(ctx);
    isGameOver() ? (gameStatus = STATUS[3],gameController.gameOver()) : requestAnimationFrame(drawFrame);
}

// 主流程
function randerGame(ctx) {
	setCanvasSize();
    const cvsSize = getCanvasSize();
    ctx.clearRect(0, 0, cvsSize.h, cvsSize.w);
    drawBackgroud(ctx);
    drawBorads(ctx);
    drawBird(ctx);
}

// 渲染小鸟
function drawBird(ctx) {
	let bird = getBird();
	bird.position.y += verticalSpeed;

    ctx.save();
    ctx.beginPath();
    const startPointX = bird.position.x;
    const startPointY = bird.position.y;
    ctx.rect(startPointX, startPointY, bird.size.width, bird.size.height);
    ctx.fileStyle='blue';
    ctx.fill();
    ctx.restore();

    verticalSpeed += isTouching ? grivity+flyAccVelocity : grivity;
}

// 渲染挡板
function drawBorads(ctx) {
    // 渲染所有borad
    boradsOnScreen.forEach(borad=>drawSingleBorad(ctx, borad));

    // 计算下一帧的位置
    nextFrameBorads();
}

/** 画单个挡板，如下是两个挡板 
----    ----
|  |    |  |
----    ----
----    ----
|  |    |  |
----    ----
******************************/
function drawSingleBorad(ctx, borad) {
	const cvsSize = getCanvasSize();
    ctx.save();
    ctx.translate(borad.leftX, 0);
    ctx.beginPath();
    ctx.rect(0, 0, borad.width, borad.cracks[0]);
    ctx.rect(0, borad.cracks[1], borad.width, cvsSize.h-borad.cracks[1]);
    ctx.strokeStyle = 'RGBA(0,0,0, 0.4)';
    ctx.stroke();
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.restore();
}

// 计算下一帧的borads
function nextFrameBorads() {
	const cvsSize = getCanvasSize();
    let nextBorads = boradsOnScreen.filter(borad=>{
    	borad.leftX -= horizerSpeed;
    	if (borad.leftX+borad.width < 1) {
    		releaseBorad(borad);
    		return false;
    	}
    	return true;
    });
    const lastBorad = nextBorads.length>0 ? nextBorads[nextBorads.length-1] : null;
    if (!lastBorad || lastBorad.leftX+lastBorad.width < cvsSize.w) {
        // 最后一个挡板完全进入了屏幕，在最后添加一个新的挡板
        pushNewBorad(nextBorads, cvsSize.w)
    }
    boradsOnScreen = nextBorads;
}

// 创建新的挡板，并添加到集合中
function pushNewBorad(borads, lastRight) {
	const cvsSize = getCanvasSize();
    let newBorad = getBorad();

    const MAX_DISTANCE = cvsSize.w/2;
    const MIN_DISTANCE = BIRD_WIDTH*4;
    const MAX_WIDTH = cvsSize.w/5;
    const MIN_WIDTH = BIRD_WIDTH*2/3;
    const MAX_CRACK_HEIGHT = BIRD_HEIGHT*8;
    const MIN_CRACK_HEIGHT = BIRD_HEIGHT*2;

    newBorad.leftX = lastRight + getRandFromTo(MAX_DISTANCE, MIN_DISTANCE);
    newBorad.width = getRandFromTo(MAX_WIDTH, MIN_WIDTH);
    const cracKHeight = getRandFromTo(MAX_CRACK_HEIGHT, MIN_CRACK_HEIGHT);
    const crackOffset = getRandFromTo(cvsSize.h - cracKHeight, 2);
    newBorad.cracks[0] = crackOffset;
    newBorad.cracks[1] = crackOffset + cracKHeight;

    borads.push(newBorad);
}

// 获取最大最小值之间的随机值
function getRandFromTo(max=0, min =0) {
	if (max <= min) {
		return min;
	}
	return Number((min + Math.random()*(max-min)).toFixed(2))
}

// 渲染背景
function drawBackgroud(ctx) {
    ctx.save();
    const cvsSize = getCanvasSize();
    let style = ctx.createLinearGradient(0, 0, 0, cvsSize.h);
    for (let i=0; i<cvsSize.h ; i += 49) {
    	let color;
    	color = i&1 ? 'RGBA(193, 266, 59, 0.6)' : 'RGBA(193, 266, 59, 0.3)';
        style.addColorStop(i/cvsSize.h, color);
    }
    ctx.fillStyle = style;
    ctx.fillRect(0, 0, cvsSize.w, cvsSize.h);
    ctx.restore();
}

// 判断小鸟有没有碰到挡板上 或者 顶板和地面
function isGameOver() {
    const bird = getBird();
    const cvsSize = getCanvasSize();
    let isOver = false;
    if (bird.position.y+bird.size.height > cvsSize.h) {
        isOver = true;  //撞到底边了
    } else if (bird.position.y < 0) {
    	isOver = true;  //撞到顶端了
    }

    //判断有没有撞到挡板上
    for (let borad of boradsOnScreen) {
        if (borad.isCounted) {
        	continue;
        }
        if (isCrashBorad(bird, borad, cvsSize)) {
            isOver = true;
        	break;
        }
        if (isGothroughtBorad(bird, borad)){
            ++boradCount;
            gameController && gameController.updateCount(boradCount);
            borad.isCounted = true;
        }
    }

    return isOver;
}

// 判断是否完全走过了挡板
function isGothroughtBorad(bird, borad) {
	return bird.position.x > borad.leftX+borad.width;
}

// 判断是否撞到挡板的上面或者下面部分
function isCrashBorad(bird, borad, canvasSize) {
    let birdRect = {x:bird.position.x,y:bird.position.y,width:bird.size.width,height:bird.size.height};
	let boardTopRect = {x:borad.leftX,y:0,width:borad.width,height:borad.cracks[0]};
	let boardBottomRect = {x:borad.leftX,y:borad.cracks[1],width:borad.width,height:canvasSize.h-borad.cracks[1]};
	return isRegionCrash(birdRect, boardTopRect) || isRegionCrash(birdRect, boardBottomRect);
}

// 判断两个矩形有没有重叠
function isRegionCrash(box1, box2) {
	if (box1.x >= box2.x+box2.width ||
		box2.x >= box1.x+box1.width ||
		box1.y >= box2.y+box2.height ||
		box2.y >= box1.y+box1.height) {
		return false;
	}
	return true;
}

// 获取canvas的尺寸，主要是横竖屏的情况
function setCanvasSize() {
    const canvasWrap = document.getElementById('flybird_wrap');
    canvas.width = canvasWrap.offsetWidth;
    canvas.height = canvasWrap.offsetHeight;
}

// 获取canvas高度和宽度
function getCanvasSize() {
	return {
		h: canvas.height,
		w: canvas.width
	}
}

function setTouched() {
    isTouching = true;
}

function setUnTouched() {
    isTouching = false;
}

// 处理touch事件
function bindEvent() {
	canvas.addEventListener('touchstart', setTouched);
	canvas.addEventListener('touchend', setUnTouched);
}

function unbindEvent() {
	canvas.removeEventListener('touchstart', setTouched);
	canvas.removeEventListener('touchend', setUnTouched);
}

exports.Flybird = class {
	init(controller) {
        gameController = controller;
		canvas = document.getElementById('flybird');
		ctx = canvas.getContext('2d');
        setCanvasSize();
        bindEvent();
    }

    pouse() {
        if (gameStatus == STATUS[1]) {
        	gameStatus = STATUS[2];
        }
    }

    render() {
    	if (gameStatus == STATUS[2]) {
    		gameStatus = STATUS[1];
    		return;
    	}
    	bird = null;
    	verticalSpeed = 0;
		boradCount = 0;
		gameStatus = STATUS[1];
		boradsOnScreen = [];
		randerGame(ctx);
        
    }

    start() {
        requestAnimationFrame(drawFrame);
    }

    unload() {
        unbindEvent();
        bird = null;
        canvas = null;
        ctx = null;
        boradsPool = [];
        boradsOnScreen = [];
        boradCount = 0;
        gameController = null;
    }
}