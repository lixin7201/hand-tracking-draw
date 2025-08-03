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
let hasStartedDrawing = false; // 跟踪是否开始画画
let selectedStyle = null; // AI转画选中的样式
let brushSystem = null; // 画笔系统

// 鼠标模式相关变量
let mouseCursor = null;
let mousePosition = { x: 0, y: 0 };
let isPinching = false;
let pinchCount = 0; // 记录捏合次数
let lastPinchTime = 0; // 上次捏合时间
let isDragging = false;
let dragTarget = null;
let dragStartValue = 0;
let hoveredElement = null;
let smoothPosition = { x: 0, y: 0 };
let positionHistory = [];

// 初始化 - 使用load确保所有资源都加载完成
window.addEventListener('load', async () => {
    console.log('Window loaded, checking ArtTransform...');
    
    // 确保ArtTransform已加载
    let attempts = 0;
    while (!window.ArtTransform && attempts < 10) {
        console.log('Waiting for ArtTransform to load...');
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (window.ArtTransform) {
        console.log('ArtTransform loaded successfully');
    } else {
        console.error('ArtTransform failed to load after 10 attempts');
    }
    
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
    
    // 初始化画笔系统
    brushSystem = new BrushSystem(drawingCtx);
    
    // 初始化控件
    initializeControls();
    initializeTemplates();
    initializeBrushSelector();
    initializeMouseCursor();
    
    // 初始化触摸和鼠标事件
    initializeTouchEvents();
    initializeMouseEvents();
    
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
            selectColor(e.target.dataset.color, e.target);
        });
    });
    
    // 颜色板按钮
    const colorPaletteBtn = document.getElementById('colorPaletteBtn');
    if (colorPaletteBtn) {
        colorPaletteBtn.addEventListener('click', openColorPalette);
    }
    
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
    
    // AI转画按钮
    const transformBtn = document.getElementById('transformBtn');
    if (transformBtn) {
        console.log('Transform button found, adding click listener');
        transformBtn.addEventListener('click', function(e) {
            console.log('Transform button clicked!');
            e.preventDefault();
            e.stopPropagation();
            openTransformModal();
        });
        
        // 添加一个测试点击
        transformBtn.onclick = function() {
            console.log('Transform button onclick triggered');
        };
    } else {
        console.error('Transform button not found!');
    }
    
    // 初始化AI转画功能 - 确保在DOM和脚本都准备好后
    if (document.readyState === 'complete') {
        // 如果页面已经完全加载
        setTimeout(() => {
            console.log('Initializing AI Transform from initializeControls...');
            initializeAITransform();
        }, 500);
    } else {
        // 等待页面完全加载
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.log('Initializing AI Transform from load event...');
                initializeAITransform();
            }, 500);
        });
    }
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
    
    // 计算食指和拇指之间的距离（捏合检测）
    const pinchDistance = Math.sqrt(
        Math.pow((indexTip.x - thumbTip.x) * drawingCanvas.width, 2) +
        Math.pow((indexTip.y - thumbTip.y) * drawingCanvas.height, 2)
    );
    
    // 捏合阈值（像素）
    const pinchThreshold = 35;
    
    // 检测手势状态
    if (pinchDistance < pinchThreshold) {
        // 手指捏合状态
        if (!isPinching) {
            isPinching = true;
            positionHistory = [];
            
            // 检测双击（连续两次捏合）
            const currentTime = Date.now();
            if (currentTime - lastPinchTime < 800) { // 800ms内第二次捏合
                pinchCount++;
                if (pinchCount >= 2) {
                    // 连续两次捏合，触发点击
                    performClick();
                    pinchCount = 0;
                    lastPinchTime = 0;
                }
            } else {
                // 第一次捏合
                pinchCount = 1;
                lastPinchTime = currentTime;
                
                // 显示提示
                showClickHint();
            }
        }
        
        // 更新鼠标位置（使用食指和拇指的中点）
        const rawX = ((indexTip.x + thumbTip.x) / 2) * drawingCanvas.width;
        const rawY = ((indexTip.y + thumbTip.y) / 2) * drawingCanvas.height;
        
        // 平滑处理
        positionHistory.push({ x: rawX, y: rawY });
        if (positionHistory.length > 3) { // 减少平滑帧数，提高响应
            positionHistory.shift();
        }
        
        // 计算平均位置
        smoothPosition.x = positionHistory.reduce((sum, p) => sum + p.x, 0) / positionHistory.length;
        smoothPosition.y = positionHistory.reduce((sum, p) => sum + p.y, 0) / positionHistory.length;
        
        // 查找并高亮附近元素
        const nearbyElement = findNearbyClickableElement(smoothPosition.x, smoothPosition.y);
        
        if (nearbyElement) {
            // 磁吸效果
            const rect = nearbyElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const magnetStrength = 0.5; // 增强磁吸
            
            mousePosition.x = smoothPosition.x + (centerX - smoothPosition.x) * magnetStrength;
            mousePosition.y = smoothPosition.y + (centerY - smoothPosition.y) * magnetStrength;
            
            if (hoveredElement !== nearbyElement) {
                if (hoveredElement) unhighlightElement(hoveredElement);
                hoveredElement = nearbyElement;
                highlightElement(nearbyElement);
            }
        } else {
            mousePosition.x = smoothPosition.x;
            mousePosition.y = smoothPosition.y;
            
            if (hoveredElement) {
                unhighlightElement(hoveredElement);
                hoveredElement = null;
            }
        }
        
        // 处理拖拽
        if (isDragging && dragTarget) {
            handleDrag(mousePosition.x, mousePosition.y);
        }
        
        // 显示鼠标光标
        showMouseCursor(mousePosition.x, mousePosition.y);
        
        // 停止绘制
        isDrawing = false;
        isErasing = false;
        return;
        
    } else {
        // 手指松开状态
        if (isPinching) {
            isPinching = false;
            
            // 检查是否超时（超过800ms清空计数）
            if (Date.now() - lastPinchTime > 800) {
                pinchCount = 0;
                hideClickHint();
            }
            
            // 继续保持鼠标模式，但是松开状态
            showMouseCursor(mousePosition.x, mousePosition.y);
            
            // 结束拖拽
            if (isDragging) {
                endDrag();
            }
        }
        
        // 完全离开鼠标模式的条件：距离大于100像素
        if (pinchDistance > 100) {
            if (hoveredElement) {
                unhighlightElement(hoveredElement);
            }
            
            pinchCount = 0;
            lastPinchTime = 0;
            hoveredElement = null;
            positionHistory = [];
            hideMouseCursor();
            hideClickHint();
        }
    }
    
    // 原有的手势检测逻辑
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
        if (isDrawing) {
            brushSystem.endStroke();
        }
        isDrawing = false;
        isErasing = false;
    }
}

function draw(x, y) {
    // 首次画画时隐藏标题
    if (!hasStartedDrawing) {
        hasStartedDrawing = true;
        hideSiteTitle();
    }
    
    if (drawingMode === 'coloring' && currentTemplate) {
        // 填色模式 - 使用较大的圆形画笔
        drawingCtx.fillStyle = currentColor;
        drawingCtx.globalCompositeOperation = 'multiply';
        drawingCtx.beginPath();
        drawingCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
        drawingCtx.fill();
        drawingCtx.globalCompositeOperation = 'source-over';
    } else {
        // 自由绘画模式 - 使用画笔系统
        if (!isDrawing) {
            isDrawing = true;
            lastX = x;
            lastY = y;
            brushSystem.startStroke(x, y, currentColor, brushSize);
            return;
        }
        
        // 使用画笔系统绘制
        brushSystem.drawStroke(lastX, lastY, x, y, currentColor, brushSize);
        
        lastX = x;
        lastY = y;
    }
}

function eraseAt(x, y) {
    // 使用画笔系统的橡皮擦
    const previousBrush = brushSystem.currentBrush;
    brushSystem.setBrush('eraser');
    
    if (!isDrawing) {
        isDrawing = true;
        lastX = x;
        lastY = y;
        brushSystem.startStroke(x, y, currentColor, brushSize);
    } else {
        brushSystem.drawStroke(lastX, lastY, x, y, currentColor, brushSize);
        lastX = x;
        lastY = y;
    }
}

function clearCanvas() {
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    coloringCtx.clearRect(0, 0, coloringCanvas.width, coloringCanvas.height);
    templateCtx.clearRect(0, 0, templateCanvas.width, templateCanvas.height);
    
    // 清空画布后显示标题
    hasStartedDrawing = false;
    showSiteTitle();
}

function saveDrawing() {
    // 显示保存选择弹窗
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.classList.add('show');
    }
}

// 保存带摄像头背景的图片
function saveWithCamera() {
    // 创建临时画布合并视频和绘图
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // 绘制视频帧
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    
    // 绘制用户的画
    tempCtx.drawImage(drawingCanvas, 0, 0);
    
    // 应用宽高比裁剪
    const result = createAspectRatioCanvas(tempCanvas, false);
    
    // 下载图片
    const link = document.createElement('a');
    link.download = `康康画画_原图_${result.ratio.replace(':', 'x')}_${new Date().getTime()}.png`;
    link.href = result.canvas.toDataURL();
    link.click();
    
    // 关闭弹窗
    closeSaveModal();
}

// 保存白色背景的图片
function saveWithWhiteBackground() {
    // 创建临时画布
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // 填充白色背景
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // 绘制用户的画
    tempCtx.drawImage(drawingCanvas, 0, 0);
    
    // 应用宽高比裁剪
    const result = createAspectRatioCanvas(tempCanvas, true, 'white');
    
    // 下载图片
    const link = document.createElement('a');
    link.download = `康康画画_白底_${result.ratio.replace(':', 'x')}_${new Date().getTime()}.png`;
    link.href = result.canvas.toDataURL();
    link.click();
    
    // 关闭弹窗
    closeSaveModal();
}

// 关闭保存弹窗
function closeSaveModal() {
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 颜色板相关功能
let recentColors = JSON.parse(localStorage.getItem('recentColors') || '[]');
const MAX_RECENT_COLORS = 12;

// 打开颜色板
function openColorPalette() {
    const modal = document.getElementById('colorPaletteModal');
    if (modal) {
        modal.classList.add('show');
        updateRecentColors();
        initializePaletteEvents();
    }
}

// 关闭颜色板
function closeColorPalette() {
    const modal = document.getElementById('colorPaletteModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// 选择颜色
function selectColor(color, element = null) {
    currentColor = color;
    isErasing = false;
    
    // 更新底部颜色选择器的活动状态
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    } else {
        // 如果从颜色板选择，尝试找到匹配的颜色选项
        const matchingOption = document.querySelector(`.color-option[data-color="${color}"]`);
        if (matchingOption) {
            matchingOption.classList.add('active');
        }
    }
    
    // 添加到最近使用的颜色
    addToRecentColors(color);
    
    // 关闭颜色板
    closeColorPalette();
}

// 添加到最近使用的颜色
function addToRecentColors(color) {
    // 移除已存在的相同颜色
    recentColors = recentColors.filter(c => c !== color);
    // 添加到开头
    recentColors.unshift(color);
    // 限制数量
    if (recentColors.length > MAX_RECENT_COLORS) {
        recentColors = recentColors.slice(0, MAX_RECENT_COLORS);
    }
    // 保存到本地存储
    localStorage.setItem('recentColors', JSON.stringify(recentColors));
}

// 更新最近使用的颜色显示
function updateRecentColors() {
    const container = document.getElementById('recentColors');
    if (!container) return;
    
    container.innerHTML = '';
    recentColors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'palette-color';
        colorDiv.style.background = color;
        colorDiv.dataset.color = color;
        colorDiv.onclick = () => selectColor(color);
        container.appendChild(colorDiv);
    });
}

// 应用自定义颜色
function applyCustomColor() {
    const picker = document.getElementById('customColorPicker');
    if (picker) {
        selectColor(picker.value);
    }
}

// 初始化颜色板事件
function initializePaletteEvents() {
    // 预设颜色点击事件
    const paletteColors = document.querySelectorAll('.palette-color');
    paletteColors.forEach(colorEl => {
        if (!colorEl.onclick) {
            colorEl.onclick = () => selectColor(colorEl.dataset.color);
        }
    });
    
    // 自定义颜色选择器变化事件
    const customPicker = document.getElementById('customColorPicker');
    if (customPicker && !customPicker.hasAttribute('data-initialized')) {
        customPicker.setAttribute('data-initialized', 'true');
        customPicker.addEventListener('change', () => {
            // 实时预览颜色
            const previewBtn = document.querySelector('.apply-color-btn');
            if (previewBtn) {
                previewBtn.style.background = `linear-gradient(135deg, ${customPicker.value} 0%, ${customPicker.value} 100%)`;
            }
        });
    }
}

// 确保关闭按钮功能可用
window.closeColorPalette = closeColorPalette;
window.applyCustomColor = applyCustomColor;

// 支持的宽高比列表
const SUPPORTED_RATIOS = [
    { ratio: "1:1", value: 1 },
    { ratio: "16:9", value: 16/9 },
    { ratio: "21:9", value: 21/9 },
    { ratio: "3:2", value: 3/2 },
    { ratio: "2:3", value: 2/3 },
    { ratio: "4:5", value: 4/5 },
    { ratio: "5:4", value: 5/4 },
    { ratio: "3:4", value: 3/4 },
    { ratio: "4:3", value: 4/3 },
    { ratio: "9:16", value: 9/16 },
    { ratio: "9:21", value: 9/21 }
];

// 获取最接近的支持宽高比
function getClosestAspectRatio(width, height) {
    const currentRatio = width / height;
    let closestRatio = SUPPORTED_RATIOS[0];
    let minDiff = Math.abs(currentRatio - closestRatio.value);
    
    for (const ratio of SUPPORTED_RATIOS) {
        const diff = Math.abs(currentRatio - ratio.value);
        if (diff < minDiff) {
            minDiff = diff;
            closestRatio = ratio;
        }
    }
    
    return closestRatio;
}

// 计算裁剪区域以匹配目标宽高比
function calculateCropArea(sourceWidth, sourceHeight, targetRatio) {
    const currentRatio = sourceWidth / sourceHeight;
    let cropX = 0, cropY = 0, cropWidth = sourceWidth, cropHeight = sourceHeight;
    
    if (currentRatio > targetRatio.value) {
        // 图片太宽，需要裁剪左右
        cropWidth = sourceHeight * targetRatio.value;
        cropX = (sourceWidth - cropWidth) / 2;
    } else if (currentRatio < targetRatio.value) {
        // 图片太高，需要裁剪上下
        cropHeight = sourceWidth / targetRatio.value;
        cropY = (sourceHeight - cropHeight) / 2;
    }
    
    return {
        x: Math.round(cropX),
        y: Math.round(cropY),
        width: Math.round(cropWidth),
        height: Math.round(cropHeight)
    };
}

// 创建符合比例的画布
function createAspectRatioCanvas(sourceCanvas, withBackground = false, backgroundColor = 'white') {
    const sourceWidth = sourceCanvas.width;
    const sourceHeight = sourceCanvas.height;
    
    // 获取最接近的支持宽高比
    const targetRatio = getClosestAspectRatio(sourceWidth, sourceHeight);
    
    // 计算裁剪区域
    const cropArea = calculateCropArea(sourceWidth, sourceHeight, targetRatio);
    
    // 创建新的画布
    const outputCanvas = document.createElement('canvas');
    
    // 设置输出尺寸（保持合理的输出大小）
    const maxSize = 1920; // 最大边长
    if (cropArea.width > cropArea.height) {
        outputCanvas.width = Math.min(cropArea.width, maxSize);
        outputCanvas.height = outputCanvas.width / targetRatio.value;
    } else {
        outputCanvas.height = Math.min(cropArea.height, maxSize);
        outputCanvas.width = outputCanvas.height * targetRatio.value;
    }
    
    const outputCtx = outputCanvas.getContext('2d');
    
    // 如果需要背景，先填充背景
    if (withBackground) {
        outputCtx.fillStyle = backgroundColor;
        outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
    }
    
    // 绘制裁剪后的图像
    outputCtx.drawImage(
        sourceCanvas,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, outputCanvas.width, outputCanvas.height
    );
    
    return {
        canvas: outputCanvas,
        ratio: targetRatio.ratio
    };
}

// 将函数暴露到全局作用域
window.saveWithCamera = saveWithCamera;
window.saveWithWhiteBackground = saveWithWhiteBackground;
window.closeSaveModal = closeSaveModal;

// 添加触摸事件支持（用于移动设备）
let touchDrawing = false;
let touchLastX = 0;
let touchLastY = 0;

// 初始化触摸事件（需要在drawingCanvas初始化后调用）
function initializeTouchEvents() {
    if (!drawingCanvas) {
        console.error('drawingCanvas not initialized for touch events');
        return;
    }
    
    drawingCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawingCanvas.getBoundingClientRect();
    touchLastX = touch.clientX - rect.left;
    touchLastY = touch.clientY - rect.top;
    touchDrawing = true;
    
    // 首次触摸时隐藏标题
    if (!hasStartedDrawing) {
        hasStartedDrawing = true;
        hideSiteTitle();
    }
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
}

// 添加鼠标事件支持（用于没有摄像头的情况）
let mouseDrawing = false;

// 初始化鼠标事件（需要在drawingCanvas初始化后调用）
function initializeMouseEvents() {
    if (!drawingCanvas) {
        console.error('drawingCanvas not initialized for mouse events');
        return;
    }
    
    drawingCanvas.addEventListener('mousedown', (e) => {
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    mouseDrawing = true;
    drawingCanvas.style.pointerEvents = 'auto';
    
    // 首次鼠标绘画时隐藏标题
    if (!hasStartedDrawing) {
        hasStartedDrawing = true;
        hideSiteTitle();
    }
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
}

// 鼠标模式相关函数
function initializeMouseCursor() {
    // 创建鼠标光标元素
    mouseCursor = document.createElement('div');
    mouseCursor.id = 'virtualMouse';
    mouseCursor.style.cssText = `
        position: absolute;
        width: 40px;
        height: 40px;
        border: 3px solid #667eea;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        display: none;
        transform: translate(-50%, -50%);
        transition: all 0.15s ease;
    `;
    document.body.appendChild(mouseCursor);
    
    // 添加状态提示
    const statusText = document.createElement('div');
    statusText.id = 'mouseStatusText';
    statusText.style.cssText = `
        position: absolute;
        top: -30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        white-space: nowrap;
        display: none;
    `;
    mouseCursor.appendChild(statusText);
    
    // 创建点击动画元素
    const clickAnimation = document.createElement('div');
    clickAnimation.id = 'clickAnimation';
    clickAnimation.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid #4CAF50;
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
    `;
    mouseCursor.appendChild(clickAnimation);
    
    // 添加中心点
    const centerDot = document.createElement('div');
    centerDot.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: #667eea;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;
    mouseCursor.appendChild(centerDot);
}

function showMouseCursor(x, y) {
    if (mouseCursor) {
        mouseCursor.style.display = 'block';
        mouseCursor.style.left = x + 'px';
        mouseCursor.style.top = y + 'px';
        
        // 根据状态改变光标样式
        if (hoveredElement) {
            mouseCursor.style.width = '50px';
            mouseCursor.style.height = '50px';
            mouseCursor.style.borderColor = '#4CAF50';
        } else {
            mouseCursor.style.width = '40px';
            mouseCursor.style.height = '40px';
            mouseCursor.style.borderColor = '#667eea';
        }
        
        if (isDragging) {
            mouseCursor.style.borderWidth = '4px';
            mouseCursor.style.borderColor = '#ff9800';
        } else {
            mouseCursor.style.borderWidth = '3px';
        }
    }
}

// 显示点击提示
function showClickHint() {
    if (mouseCursor) {
        const statusText = document.getElementById('mouseStatusText');
        if (statusText) {
            statusText.style.display = 'block';
            if (pinchCount === 1) {
                statusText.textContent = '再次捏合点击';
                statusText.style.background = 'rgba(255, 152, 0, 0.9)';
                mouseCursor.style.borderColor = '#ff9800';
                mouseCursor.style.borderWidth = '4px';
            }
        }
    }
}

// 隐藏点击提示
function hideClickHint() {
    const statusText = document.getElementById('mouseStatusText');
    if (statusText) {
        statusText.style.display = 'none';
        statusText.style.background = 'rgba(0, 0, 0, 0.7)';
    }
    if (mouseCursor) {
        mouseCursor.style.borderColor = '#667eea';
        mouseCursor.style.borderWidth = '3px';
    }
}

function hideMouseCursor() {
    if (mouseCursor) {
        mouseCursor.style.display = 'none';
        mouseCursor.style.borderStyle = 'solid';
        
        const statusText = document.getElementById('mouseStatusText');
        if (statusText) {
            statusText.style.display = 'none';
        }
    }
    pinchCount = 0;
    lastPinchTime = 0;
}

// 执行点击
function performClick() {
    const targetElement = hoveredElement || findNearbyClickableElement(mousePosition.x, mousePosition.y);
    
    if (targetElement) {
        // 检查是否是滑块
        if (targetElement.tagName === 'INPUT' && targetElement.type === 'range') {
            // 开始拖拽滑块
            startDrag(targetElement);
        } else {
            // 普通点击
            targetElement.click();
            
            // 视觉反馈
            clickFeedback(targetElement);
        }
        
        // 成功点击的额外反馈
        if (mouseCursor) {
            mouseCursor.style.borderColor = '#4CAF50';
            mouseCursor.style.borderWidth = '5px';
            setTimeout(() => {
                mouseCursor.style.borderColor = hoveredElement ? '#4CAF50' : '#667eea';
                mouseCursor.style.borderWidth = '3px';
            }, 300);
        }
    }
    
    // 点击动画
    if (mouseCursor) {
        const clickAnimation = document.getElementById('clickAnimation');
        if (clickAnimation) {
            clickAnimation.style.animation = 'clickPulse 0.3s ease-out';
            setTimeout(() => {
                clickAnimation.style.animation = '';
            }, 300);
        }
    }
    
    // 隐藏提示
    hideClickHint();
}

// 点击反馈
function clickFeedback(element) {
    const originalBackground = element.style.background;
    const originalTransform = element.style.transform;
    
    element.style.background = 'rgba(76, 175, 80, 0.3)';
    element.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        element.style.background = originalBackground;
        element.style.transform = originalTransform;
    }, 200);
    
    // 震动反馈
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// 开始拖拽
function startDrag(element) {
    isDragging = true;
    dragTarget = element;
    dragStartValue = parseFloat(element.value);
    
    // 高亮拖拽目标
    element.style.boxShadow = '0 0 20px rgba(255, 152, 0, 0.8)';
}

// 处理拖拽
function handleDrag(x, y) {
    if (!dragTarget || dragTarget.tagName !== 'INPUT') return;
    
    const rect = dragTarget.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    const min = parseFloat(dragTarget.min) || 0;
    const max = parseFloat(dragTarget.max) || 100;
    const value = min + (max - min) * percentage;
    
    dragTarget.value = Math.round(value);
    
    // 触发input事件
    const event = new Event('input', { bubbles: true });
    dragTarget.dispatchEvent(event);
}

// 结束拖拽
function endDrag() {
    if (dragTarget) {
        dragTarget.style.boxShadow = '';
    }
    isDragging = false;
    dragTarget = null;
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes clickPulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 查找附近的可点击元素
function findNearbyClickableElement(x, y) {
    const searchRadius = 60; // 搜索半径
    const elements = document.elementsFromPoint(x, y);
    
    // 首先检查直接点击位置
    const directHit = elements.find(el => 
        el.id !== 'drawingCanvas' && 
        el.id !== 'handCanvas' && 
        el.id !== 'virtualMouse' &&
        el.id !== 'video' &&
        (el.tagName === 'BUTTON' || 
         el.classList.contains('color-option') || 
         el.classList.contains('template-btn') ||
         el.classList.contains('mode-btn') ||
         el.tagName === 'INPUT')
    );
    
    if (directHit) return directHit;
    
    // 如果没有直接命中，搜索附近区域
    const clickables = document.querySelectorAll('button, .color-option, .template-btn, .mode-btn, input');
    let nearestElement = null;
    let nearestDistance = searchRadius;
    
    clickables.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestElement = el;
        }
    });
    
    return nearestElement;
}

// 高亮悬停元素
function highlightElement(element) {
    if (!element) return;
    
    element.style.transition = 'all 0.2s ease';
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.6)';
    element.style.zIndex = '1001';
    
    // 为颜色选项添加特殊效果
    if (element.classList.contains('color-option')) {
        element.style.transform = 'scale(1.3)';
    }
}

// 取消高亮
function unhighlightElement(element) {
    if (!element) return;
    
    element.style.transform = '';
    element.style.boxShadow = '';
    element.style.zIndex = '';
}

// 隐藏网站标题
function hideSiteTitle() {
    const title = document.getElementById('siteTitle');
    if (title) {
        title.classList.add('hidden');
    }
}

// 显示网站标题
function showSiteTitle() {
    const title = document.getElementById('siteTitle');
    if (title) {
        title.classList.remove('hidden');
    }
}

// AI转画功能相关函数

function initializeAITransform() {
    console.log('Initializing AI Transform...');
    
    // 生成样式选项
    const styleGrid = document.getElementById('styleGrid');
    if (!styleGrid) {
        console.error('Style grid element not found');
        return;
    }
    
    if (!window.ArtTransform) {
        console.error('ArtTransform not loaded');
        return;
    }
    
    // 清空现有内容（避免重复）
    styleGrid.innerHTML = '';
    
    Object.entries(window.ArtTransform.ART_STYLES).forEach(([key, style]) => {
        const styleOption = document.createElement('div');
        styleOption.className = 'style-option';
        styleOption.dataset.style = key;
        styleOption.innerHTML = `
            <div class="style-option-icon">${style.icon}</div>
            <div class="style-option-name">${style.name}</div>
            <div class="style-option-desc">${style.description}</div>
        `;
        
        // 使用addEventListener而不是onclick确保事件绑定
        styleOption.addEventListener('click', function() {
            console.log('Style clicked:', key);
            selectArtStyle(key);
        });
        
        styleGrid.appendChild(styleOption);
    });
    
    console.log('Style options created:', styleGrid.children.length);
    
    // 绑定转换按钮
    const startTransformBtn = document.getElementById('startTransformBtn');
    if (startTransformBtn) {
        startTransformBtn.addEventListener('click', startTransformation);
    }
    
    // 绑定结果弹窗按钮
    const saveResultBtn = document.getElementById('saveResultBtn');
    if (saveResultBtn) {
        saveResultBtn.addEventListener('click', saveTransformResult);
    }
    
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', () => {
            closeResultModal();
            openTransformModal();
        });
    }
}

function openTransformModal() {
    console.log('Opening transform modal...');
    const modal = document.getElementById('transformModal');
    
    if (!modal) {
        console.error('Transform modal element not found!');
        return;
    }
    
    modal.classList.add('show');
    console.log('Modal shown');
    
    // 重置选择
    selectedStyle = null;
    document.querySelectorAll('.style-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const descInput = document.getElementById('doodleDescription');
    if (descInput) {
        descInput.value = '';
    }
    
    // 如果样式还没有初始化，现在初始化
    const styleGrid = document.getElementById('styleGrid');
    if (styleGrid && styleGrid.children.length === 0) {
        console.log('Style grid empty, initializing now...');
        initializeAITransform();
    }
}

function closeTransformModal() {
    const modal = document.getElementById('transformModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function selectArtStyle(style) {
    console.log('Selecting style:', style);
    selectedStyle = style;
    
    // 更新所有样式选项的选中状态
    document.querySelectorAll('.style-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.style === style) {
            opt.classList.add('selected');
            console.log('Style selected:', style);
        }
    });
}

async function startTransformation() {
    console.log('Starting transformation with style:', selectedStyle);
    
    if (!selectedStyle) {
        alert('请先选择一个艺术风格！');
        return;
    }
    
    const description = document.getElementById('doodleDescription').value;
    console.log('Description:', description || 'No description provided');
    const progressDiv = document.getElementById('transformProgress');
    const progressText = document.getElementById('progressText');
    const startBtn = document.getElementById('startTransformBtn');
    
    // 显示进度
    progressDiv.style.display = 'block';
    startBtn.disabled = true;
    
    try {
        // 合并画布（包含用户的涂鸦）
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = drawingCanvas.width;
        tempCanvas.height = drawingCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // 白色背景
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // 绘制用户的画
        tempCtx.drawImage(drawingCanvas, 0, 0);
        
        // 调用AI转换
        const result = await window.ArtTransform.transformDoodleToArt(
            tempCanvas,
            selectedStyle,
            description,
            (status) => {
                progressText.textContent = status;
            }
        );
        
        // 显示结果
        showTransformResult(result);
        
        // 关闭转换弹窗
        closeTransformModal();
        
    } catch (error) {
        console.error('Transformation error:', error);
        alert('转换失败: ' + error.message);
    } finally {
        progressDiv.style.display = 'none';
        startBtn.disabled = false;
        progressText.textContent = '正在准备...';
    }
}

function showTransformResult(result) {
    const resultModal = document.getElementById('resultModal');
    const originalImage = document.getElementById('originalImage');
    const transformedImage = document.getElementById('transformedImage');
    const styleTitle = document.getElementById('resultStyleTitle');
    
    if (resultModal && originalImage && transformedImage) {
        originalImage.src = result.originalImage;
        transformedImage.src = result.artworkUrl;
        styleTitle.textContent = result.style + '风格';
        
        resultModal.classList.add('show');
        
        // 保存结果到全局变量以便保存
        window.currentTransformResult = result;
    }
}

function closeResultModal() {
    const modal = document.getElementById('resultModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveTransformResult() {
    if (!window.currentTransformResult) return;
    
    const link = document.createElement('a');
    link.download = `康康画画_AI艺术_${window.currentTransformResult.style}_${new Date().getTime()}.png`;
    link.href = window.currentTransformResult.artworkUrl;
    link.click();
}

// 将函数暴露到全局作用域
window.closeTransformModal = closeTransformModal;
window.closeResultModal = closeResultModal;

// 初始化画笔选择器
function initializeBrushSelector() {
    const brushList = document.getElementById('brushList');
    if (!brushList || !brushSystem) return;
    
    // 清空列表
    brushList.innerHTML = '';
    
    // 画笔描述
    const brushDescriptions = {
        marker: '鲜艳流畅',
        coloredPencil: '细节丰富',
        watercolor: '渐变晕染',
        pencil: '素描质感',
        spray: '喷溅效果',
        roller: '大面积涂抹',
        crayon: '儿童友好',
        pastel: '柔和粉色',
        eraser: '擦除内容'
    };
    
    // 创建画笔选项
    Object.keys(brushSystem.brushes).forEach((brushKey, index) => {
        const brush = brushSystem.brushes[brushKey];
        const brushItem = document.createElement('div');
        brushItem.className = 'brush-item';
        if (index === 0) brushItem.classList.add('active');
        
        brushItem.innerHTML = `
            <span class="brush-item-icon">${brush.icon}</span>
            <div class="brush-item-info">
                <div class="brush-item-name">${brush.name}</div>
                <div class="brush-item-desc">${brushDescriptions[brushKey] || ''}</div>
            </div>
        `;
        
        brushItem.onclick = () => selectBrush(brushKey, brushItem);
        brushList.appendChild(brushItem);
    });
    
    // 初始化画笔参数控件
    initializeBrushParams();
    
    // 初始化画笔预览
    initializeBrushPreview();
}

function selectBrush(brushKey, element) {
    if (!brushSystem) return;
    
    // 设置当前画笔
    brushSystem.setBrush(brushKey);
    
    // 更新UI状态
    document.querySelectorAll('.brush-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
    
    // 更新参数控件可见性
    updateBrushParamsVisibility(brushKey);
    
    // 更新预览
    updateBrushPreview();
    
    // 如果选择了橡皮擦，设置相应状态
    isErasing = (brushKey === 'eraser');
}

function initializeBrushParams() {
    // 透明度控制
    const opacitySlider = document.getElementById('brushOpacity');
    const opacityValue = document.getElementById('opacityValue');
    if (opacitySlider && opacityValue) {
        opacitySlider.addEventListener('input', (e) => {
            const value = e.target.value;
            opacityValue.textContent = value + '%';
            updateBrushPreview();
        });
    }
    
    // 纹理控制
    const textureSlider = document.getElementById('brushTexture');
    const textureValue = document.getElementById('textureValue');
    if (textureSlider && textureValue) {
        textureSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            textureValue.textContent = value + '%';
            updateBrushPreview();
        });
    }
    
    // 散布控制
    const scatterSlider = document.getElementById('brushScatter');
    const scatterValue = document.getElementById('scatterValue');
    if (scatterSlider && scatterValue) {
        scatterSlider.addEventListener('input', (e) => {
            const value = e.target.value;
            scatterValue.textContent = value;
            updateBrushPreview();
        });
    }
}

function updateBrushParamsVisibility(brushKey) {
    const textureParam = document.getElementById('textureParam');
    const scatterParam = document.getElementById('scatterParam');
    
    // 根据画笔类型显示不同参数
    if (textureParam) {
        textureParam.style.display = 
            ['coloredPencil', 'pencil', 'crayon', 'pastel'].includes(brushKey) ? 'block' : 'none';
    }
    
    if (scatterParam) {
        scatterParam.style.display = brushKey === 'spray' ? 'block' : 'none';
    }
}

function initializeBrushPreview() {
    const canvas = document.getElementById('brushPreview');
    if (!canvas) return;
    
    updateBrushPreview();
}

function updateBrushPreview() {
    const canvas = document.getElementById('brushPreview');
    if (!canvas || !brushSystem) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 创建临时画笔系统用于预览
    const previewBrush = new BrushSystem(ctx);
    previewBrush.setBrush(brushSystem.currentBrush);
    
    // 绘制预览线条
    const startX = 20;
    const startY = height / 2;
    const endX = width - 20;
    const endY = height / 2;
    
    // 绘制波浪线以展示效果
    const steps = 30;
    let prevX = startX;
    let prevY = startY;
    
    previewBrush.startStroke(prevX, prevY, currentColor, brushSize);
    
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const x = startX + (endX - startX) * t;
        const y = startY + Math.sin(t * Math.PI * 2) * 10;
        
        previewBrush.drawStroke(prevX, prevY, x, y, currentColor, brushSize);
        prevX = x;
        prevY = y;
    }
    
    previewBrush.endStroke();
}