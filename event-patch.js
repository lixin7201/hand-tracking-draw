// 触摸和鼠标事件增强补丁
// 这个文件提供了对触摸和鼠标事件的画笔系统支持

// 添加状态变量
let touchIsDrawing = false;
let mouseIsDrawing = false;

// 重写原有的触摸事件处理
function enhanceTouchEvents() {
    const originalTouchMove = drawingCanvas.ontouchmove;
    const originalTouchEnd = drawingCanvas.ontouchend;
    
    // 增强触摸移动事件
    const enhancedTouchMove = function(e) {
        e.preventDefault();
        if (!touchDrawing) return;
        
        const touch = e.touches[0];
        const rect = drawingCanvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        if (drawingMode === 'coloring' && currentTemplate) {
            // 填色模式保持原有逻辑
            drawingCtx.fillStyle = currentColor;
            drawingCtx.globalCompositeOperation = 'multiply';
            drawingCtx.beginPath();
            drawingCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
            drawingCtx.fill();
            drawingCtx.globalCompositeOperation = 'source-over';
        } else {
            // 自由绘画模式使用画笔系统
            if (brushSystem) {
                if (!touchIsDrawing) {
                    touchIsDrawing = true;
                    brushSystem.startStroke(x, y, currentColor, brushSize);
                } else {
                    brushSystem.drawStroke(touchLastX, touchLastY, x, y, currentColor, brushSize);
                }
            }
        }
        
        touchLastX = x;
        touchLastY = y;
    };
    
    // 增强触摸结束事件
    const enhancedTouchEnd = function(e) {
        e.preventDefault();
        touchDrawing = false;
        touchIsDrawing = false;
        if (brushSystem) {
            brushSystem.endStroke();
        }
    };
    
    // 移除旧的事件监听器并添加新的
    drawingCanvas.removeEventListener('touchmove', originalTouchMove);
    drawingCanvas.removeEventListener('touchend', originalTouchEnd);
    
    drawingCanvas.addEventListener('touchmove', enhancedTouchMove, { passive: false });
    drawingCanvas.addEventListener('touchend', enhancedTouchEnd, { passive: false });
}

// 重写原有的鼠标事件处理
function enhanceMouseEvents() {
    const originalMouseMove = drawingCanvas.onmousemove;
    const originalMouseUp = drawingCanvas.onmouseup;
    
    // 增强鼠标移动事件
    const enhancedMouseMove = function(e) {
        if (!mouseDrawing) return;
        
        const rect = drawingCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (drawingMode === 'coloring' && currentTemplate) {
            // 填色模式保持原有逻辑
            drawingCtx.fillStyle = currentColor;
            drawingCtx.globalCompositeOperation = 'multiply';
            drawingCtx.beginPath();
            drawingCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2);
            drawingCtx.fill();
            drawingCtx.globalCompositeOperation = 'source-over';
        } else {
            // 自由绘画模式使用画笔系统
            if (brushSystem) {
                if (!mouseIsDrawing) {
                    mouseIsDrawing = true;
                    brushSystem.startStroke(x, y, currentColor, brushSize);
                } else {
                    brushSystem.drawStroke(lastX, lastY, x, y, currentColor, brushSize);
                }
            }
        }
        
        lastX = x;
        lastY = y;
    };
    
    // 增强鼠标松开事件
    const enhancedMouseUp = function() {
        mouseDrawing = false;
        mouseIsDrawing = false;
        drawingCanvas.style.pointerEvents = 'none';
        if (brushSystem) {
            brushSystem.endStroke();
        }
    };
    
    // 移除旧的事件监听器并添加新的
    drawingCanvas.removeEventListener('mousemove', originalMouseMove);
    drawingCanvas.removeEventListener('mouseup', originalMouseUp);
    
    drawingCanvas.addEventListener('mousemove', enhancedMouseMove);
    drawingCanvas.addEventListener('mouseup', enhancedMouseUp);
}

// 在初始化完成后应用增强
setTimeout(() => {
    if (typeof drawingCanvas !== 'undefined' && typeof brushSystem !== 'undefined') {
        enhanceTouchEvents();
        enhanceMouseEvents();
        console.log('Touch and mouse events enhanced with brush system');
    }
}, 1000);