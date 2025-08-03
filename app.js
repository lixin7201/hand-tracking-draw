// 全局变量
let video, drawingCanvas, handCanvas, drawingCtx, handCtx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#FF0000';
let brushSize = 5;
let isErasing = false;
let hands;
let camera;
let currentTemplate = null;
let drawingMode = 'free'; // 'free' 或 'coloring'
let templateCanvas, templateCtx;
let coloringCanvas, coloringCtx;

// 初始化
window.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

async function initializeApp() {
    // 获取DOM元素
    video = document.getElementById('video');
    drawingCanvas = document.getElementById('drawingCanvas');
    handCanvas = document.getElementById('handCanvas');
    drawingCtx = drawingCanvas.getContext('2d');
    handCtx = handCanvas.getContext('2d');
    
    // 创建模板画布
    templateCanvas = document.createElement('canvas');
    templateCtx = templateCanvas.getContext('2d');
    coloringCanvas = document.createElement('canvas');
    coloringCtx = coloringCanvas.getContext('2d');
    
    // 设置画布大小
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化控件
    initializeControls();
    initializeTemplates();
    
    // 初始化MediaPipe Hands
    await initializeHandTracking();
    
    // 启动摄像头
    await startCamera();
}

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    drawingCanvas.width = width;
    drawingCanvas.height = height;
    handCanvas.width = width;
    handCanvas.height = height;
    templateCanvas.width = width;
    templateCanvas.height = height;
    coloringCanvas.width = width;
    coloringCanvas.height = height;
    
    // 重绘模板
    if (currentTemplate) {
        drawCurrentTemplate();
    }
}

function initializeTemplates() {
    const animalGrid = document.getElementById('animalTemplates');
    const plantGrid = document.getElementById('plantTemplates');
    
    // 添加动物模板按钮
    drawingTemplates.animals.forEach(template => {
        const btn = document.createElement('button');
        btn.className = 'template-btn';
        btn.innerHTML = template.icon;
        btn.title = template.name;
        btn.onclick = () => selectTemplate(template);
        animalGrid.appendChild(btn);
    });
    
    // 添加植物模板按钮
    drawingTemplates.plants.forEach(template => {
        const btn = document.createElement('button');
        btn.className = 'template-btn';
        btn.innerHTML = template.icon;
        btn.title = template.name;
        btn.onclick = () => selectTemplate(template);
        plantGrid.appendChild(btn);
    });
    
    // 模式切换按钮
    document.getElementById('freeDrawBtn').onclick = () => setDrawingMode('free');
    document.getElementById('coloringBtn').onclick = () => setDrawingMode('coloring');
    
    // 加载模板按钮
    document.getElementById('loadTemplateBtn').onclick = loadSelectedTemplate;
}

function selectTemplate(template) {
    currentTemplate = template;
    // 更新按钮样式
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.title === template.name) {
            btn.classList.add('active');
        }
    });
}

function setDrawingMode(mode) {
    drawingMode = mode;
    document.getElementById('freeDrawBtn').classList.toggle('active', mode === 'free');
    document.getElementById('coloringBtn').classList.toggle('active', mode === 'coloring');
}

function loadSelectedTemplate() {
    if (!currentTemplate) {
        alert('请先选择一个模板！');
        return;
    }
    
    // 清空画布
    clearCanvas();
    
    // 绘制模板到画布
    drawCurrentTemplate();
}

function drawCurrentTemplate() {
    if (!currentTemplate) return;
    
    // 计算缩放比例以适应屏幕
    const scale = Math.min(drawingCanvas.width / 800, drawingCanvas.height / 600);
    
    // 清空模板画布
    templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
    
    // 保存当前状态
    templateCtx.save();
    
    // 居中显示
    const offsetX = (drawingCanvas.width - 800 * scale) / 2;
    const offsetY = (drawingCanvas.height - 600 * scale) / 2;
    templateCtx.translate(offsetX, offsetY);
    
    // 绘制模板
    drawTemplate(templateCtx, currentTemplate, scale);
    
    // 恢复状态
    templateCtx.restore();
    
    // 将模板复制到主画布
    drawingCtx.drawImage(templateCanvas, 0, 0);
}

function initializeControls() {
    // 颜色选择器
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            e.target.classList.add('active');
            currentColor = e.target.dataset.color;
            isErasing = false;
        });
    });
    
    // 画笔大小
    const brushSizeInput = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        brushSizeValue.textContent = brushSize;
    });
    
    // 清空按钮
    document.getElementById('clearBtn').addEventListener('click', clearCanvas);
    
    // 保存按钮
    document.getElementById('saveBtn').addEventListener('click', saveDrawing);
}

async function initializeHandTracking() {
    try {
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
            }
        });
        
        // 移动端使用更低的复杂度以提高性能
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: isMobile ? 0 : 1, // 移动端使用简单模型
            minDetectionConfidence: isMobile ? 0.5 : 0.7,
            minTrackingConfidence: isMobile ? 0.3 : 0.5
        });
        
        hands.onResults(onHandResults);
    } catch (error) {
        console.error('MediaPipe Hands 初始化失败:', error);
        document.getElementById('loading').textContent = 'MediaPipe 初始化失败，仅支持触摸/鼠标绘画';
    }
}

async function startCamera() {
    const loading = document.getElementById('loading');
    const status = document.getElementById('status');
    
    try {
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        loading.textContent = '正在启动摄像头...';
        
        // 为移动设备优化的摄像头配置
        const constraints = {
            video: isMobile ? {
                facingMode: 'environment', // 移动端优先使用后置摄像头
                width: { ideal: 640 },
                height: { ideal: 480 }
            } : {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };
        
        // 请求摄像头权限
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (firstError) {
            console.log('首次尝试失败，使用备用配置:', firstError);
            // 如果失败，尝试更简单的配置
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });
        }
        
        // 设置视频流
        video.srcObject = stream;
        
        // 等待视频元数据加载
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
        
        // 初始化MediaPipe Camera
        if (window.Camera) {
            camera = new Camera(video, {
                onFrame: async () => {
                    if (hands && video.readyState === 4) {
                        await hands.send({ image: video });
                    }
                },
                width: isMobile ? 640 : 1280,
                height: isMobile ? 480 : 720
            });
            
            camera.start();
        } else {
            // 如果Camera不可用，使用备用方法
            console.log('MediaPipe Camera 不可用，使用备用方法');
            startAlternativeTracking();
        }
        
        loading.style.display = 'none';
        status.style.display = 'block';
        status.textContent = isMobile ? '手机摄像头已启动' : '手势检测已启动';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
        
    } catch (error) {
        console.error('摄像头访问失败:', error);
        loading.innerHTML = `
            <div style="text-align: center;">
                <p>摄像头访问失败</p>
                <p style="font-size: 14px; margin-top: 10px;">错误: ${error.message}</p>
                <p style="font-size: 12px; margin-top: 10px;">
                    请检查：<br>
                    1. 是否允许摄像头权限<br>
                    2. 是否使用HTTPS访问<br>
                    3. 浏览器是否支持
                </p>
                <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 10px; cursor: pointer;">重试</button>
            </div>
        `;
    }
}

// 备用的追踪方法（当MediaPipe Camera不可用时）
function startAlternativeTracking() {
    const processFrame = async () => {
        if (hands && video.readyState === 4) {
            await hands.send({ image: video });
        }
        requestAnimationFrame(processFrame);
    };
    processFrame();
}

function onHandResults(results) {
    // 清空手部画布
    handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // 绘制手部关键点
        drawHandLandmarks(landmarks);
        
        // 检测手势并执行相应操作
        detectGestureAndDraw(landmarks);
    } else {
        // 没有检测到手时停止绘制
        isDrawing = false;
    }
}

function drawHandLandmarks(landmarks) {
    handCtx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    handCtx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    handCtx.lineWidth = 2;
    
    // 绘制关键点
    landmarks.forEach(landmark => {
        const x = landmark.x * handCanvas.width;
        const y = landmark.y * handCanvas.height;
        
        handCtx.beginPath();
        handCtx.arc(x, y, 5, 0, 2 * Math.PI);
        handCtx.fill();
    });
    
    // 绘制连接线
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],  // 拇指
        [0, 5], [5, 6], [6, 7], [7, 8],  // 食指
        [5, 9], [9, 10], [10, 11], [11, 12],  // 中指
        [9, 13], [13, 14], [14, 15], [15, 16],  // 无名指
        [13, 17], [17, 18], [18, 19], [19, 20],  // 小指
        [0, 17]  // 手掌
    ];
    
    connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];
        
        handCtx.beginPath();
        handCtx.moveTo(startPoint.x * handCanvas.width, startPoint.y * handCanvas.height);
        handCtx.lineTo(endPoint.x * handCanvas.width, endPoint.y * handCanvas.height);
        handCtx.stroke();
    });
}

function detectGestureAndDraw(landmarks) {
    // 获取关键点位置
    const indexTip = landmarks[8];  // 食指尖
    const indexMcp = landmarks[5];  // 食指根部
    const middleTip = landmarks[12];  // 中指尖
    const middleMcp = landmarks[9];  // 中指根部
    const ringTip = landmarks[16];  // 无名指尖
    const ringMcp = landmarks[13];  // 无名指根部
    const pinkyTip = landmarks[20];  // 小指尖
    const pinkyMcp = landmarks[17];  // 小指根部
    const thumbTip = landmarks[4];  // 拇指尖
    const thumbMcp = landmarks[2];  // 拇指根部
    
    // 计算手指是否伸直
    const isIndexUp = indexTip.y < indexMcp.y - 0.05;
    const isMiddleUp = middleTip.y < middleMcp.y - 0.05;
    const isRingUp = ringTip.y < ringMcp.y - 0.05;
    const isPinkyUp = pinkyTip.y < pinkyMcp.y - 0.05;
    const isThumbUp = Math.abs(thumbTip.x - thumbMcp.x) > 0.05;
    
    // 计算伸直的手指数量
    const fingersUp = [isIndexUp, isMiddleUp, isRingUp, isPinkyUp, isThumbUp].filter(x => x).length;
    
    // 获取食指尖位置（用于绘制）
    const x = indexTip.x * drawingCanvas.width;
    const y = indexTip.y * drawingCanvas.height;
    
    // 根据手势执行不同操作
    if (fingersUp === 5) {
        // 五指张开 - 清空画布
        clearCanvas();
        isDrawing = false;
    } else if (fingersUp === 2 && isIndexUp && isMiddleUp) {
        // 两指（食指和中指） - 橡皮擦模式
        if (!isErasing) {
            isErasing = true;
            isDrawing = false;
        }
        eraseAt(x, y);
    } else if (fingersUp === 1 && isIndexUp) {
        // 只有食指 - 绘制模式
        isErasing = false;
        draw(x, y);
    } else {
        // 其他手势 - 停止绘制
        isDrawing = false;
        isErasing = false;
    }
}

function draw(x, y) {
    if (drawingMode === 'coloring' && currentTemplate) {
        // 填色模式 - 使用较大的圆形画笔
        drawingCtx.fillStyle = currentColor;
        drawingCtx.globalCompositeOperation = 'multiply';
        drawingCtx.beginPath();
        drawingCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
        drawingCtx.fill();
        drawingCtx.globalCompositeOperation = 'source-over';
    } else {
        // 自由绘画模式
        if (!isDrawing) {
            isDrawing = true;
            lastX = x;
            lastY = y;
            return;
        }
        
        drawingCtx.strokeStyle = currentColor;
        drawingCtx.lineWidth = brushSize;
        drawingCtx.lineCap = 'round';
        drawingCtx.lineJoin = 'round';
        
        drawingCtx.beginPath();
        drawingCtx.moveTo(lastX, lastY);
        drawingCtx.lineTo(x, y);
        drawingCtx.stroke();
        
        lastX = x;
        lastY = y;
    }
}

function eraseAt(x, y) {
    drawingCtx.save();
    drawingCtx.globalCompositeOperation = 'destination-out';
    drawingCtx.beginPath();
    drawingCtx.arc(x, y, brushSize * 2, 0, 2 * Math.PI);
    drawingCtx.fill();
    drawingCtx.restore();
}

function clearCanvas() {
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    coloringCtx.clearRect(0, 0, coloringCanvas.width, coloringCanvas.height);
    templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
}

function saveDrawing() {
    // 创建临时画布合并视频和绘图
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // 绘制视频帧
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    
    // 绘制用户的画
    tempCtx.drawImage(drawingCanvas, 0, 0);
    
    // 下载图片
    const link = document.createElement('a');
    link.download = `drawing_${new Date().getTime()}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
}

// 添加触摸事件支持（用于移动设备）
let touchDrawing = false;
let touchLastX = 0;
let touchLastY = 0;

drawingCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawingCanvas.getBoundingClientRect();
    touchLastX = touch.clientX - rect.left;
    touchLastY = touch.clientY - rect.top;
    touchDrawing = true;
}, { passive: false });

drawingCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!touchDrawing) return;
    
    const touch = e.touches[0];
    const rect = drawingCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (drawingMode === 'coloring' && currentTemplate) {
        // 填色模式
        drawingCtx.fillStyle = currentColor;
        drawingCtx.globalCompositeOperation = 'multiply';
        drawingCtx.beginPath();
        drawingCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
        drawingCtx.fill();
        drawingCtx.globalCompositeOperation = 'source-over';
    } else {
        // 自由绘画模式
        drawingCtx.strokeStyle = currentColor;
        drawingCtx.lineWidth = brushSize;
        drawingCtx.lineCap = 'round';
        drawingCtx.lineJoin = 'round';
        
        drawingCtx.beginPath();
        drawingCtx.moveTo(touchLastX, touchLastY);
        drawingCtx.lineTo(x, y);
        drawingCtx.stroke();
    }
    
    touchLastX = x;
    touchLastY = y;
}, { passive: false });

drawingCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchDrawing = false;
}, { passive: false });

// 添加鼠标事件支持（用于没有摄像头的情况）
let mouseDrawing = false;

drawingCanvas.addEventListener('mousedown', (e) => {
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    mouseDrawing = true;
    drawingCanvas.style.pointerEvents = 'auto';
});

drawingCanvas.addEventListener('mousemove', (e) => {
    if (!mouseDrawing) return;
    
    const rect = drawingCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (drawingMode === 'coloring' && currentTemplate) {
        // 填色模式
        drawingCtx.fillStyle = currentColor;
        drawingCtx.globalCompositeOperation = 'multiply';
        drawingCtx.beginPath();
        drawingCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
        drawingCtx.fill();
        drawingCtx.globalCompositeOperation = 'source-over';
    } else {
        // 自由绘画模式
        drawingCtx.strokeStyle = currentColor;
        drawingCtx.lineWidth = brushSize;
        drawingCtx.lineCap = 'round';
        drawingCtx.lineJoin = 'round';
        
        drawingCtx.beginPath();
        drawingCtx.moveTo(lastX, lastY);
        drawingCtx.lineTo(x, y);
        drawingCtx.stroke();
    }
    
    lastX = x;
    lastY = y;
});

drawingCanvas.addEventListener('mouseup', () => {
    mouseDrawing = false;
    drawingCanvas.style.pointerEvents = 'none';
});

drawingCanvas.addEventListener('mouseleave', () => {
    mouseDrawing = false;
    drawingCanvas.style.pointerEvents = 'none';
});