// 贴纸系统
class StickerSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stickers = [];
        this.draggedSticker = null;
        this.stickerIdCounter = 0;
        
        // 确保 canvas 有正确的尺寸
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            console.log('设置 StickerCanvas 尺寸:', this.canvas.width, 'x', this.canvas.height);
        }
        
        // 贴纸模板 - 必须在 initStickerPanel 之前定义
        this.stickerTemplates = {
            // 自然类贴纸
            coloredFlower: {
                name: '彩色花朵',
                category: 'nature',
                defaultSize: 60,
                render: (ctx, x, y, size) => {
                    // 花瓣
                    ctx.save();
                    
                    // 5个花瓣
                    for (let i = 0; i < 5; i++) {
                        ctx.save();
                        ctx.rotate((Math.PI * 2 / 5) * i);
                        ctx.fillStyle = ['#FF69B4', '#FF1493', '#FF69B4', '#FF1493', '#FF69B4'][i];
                        ctx.beginPath();
                        ctx.ellipse(0, -size/3, size/4, size/3, 0, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                    }
                    
                    // 花心
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(0, 0, size/5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 花心装饰
                    ctx.fillStyle = '#FFA500';
                    for (let i = 0; i < 3; i++) {
                        const angle = (Math.PI * 2 / 3) * i;
                        const px = Math.cos(angle) * size/10;
                        const py = Math.sin(angle) * size/10;
                        ctx.beginPath();
                        ctx.arc(px, py, size/20, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    ctx.restore();
                }
            },
            
            coloredSun: {
                name: '彩色太阳',
                category: 'nature',
                defaultSize: 80,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 太阳光线
                    ctx.strokeStyle = '#FFA500';
                    ctx.lineWidth = 3;
                    for (let i = 0; i < 8; i++) {
                        const angle = (Math.PI * 2 / 8) * i;
                        ctx.save();
                        ctx.rotate(angle);
                        ctx.beginPath();
                        ctx.moveTo(size/2, 0);
                        ctx.lineTo(size * 0.7, 0);
                        ctx.stroke();
                        ctx.restore();
                    }
                    
                    // 太阳脸
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.arc(0, 0, size/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 眼睛
                    ctx.fillStyle = '#333';
                    ctx.beginPath();
                    ctx.arc(-size/6, -size/10, size/15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(size/6, -size/10, size/15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 微笑
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, size/20, size/4, 0, Math.PI);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            },
            
            coloredCloud: {
                name: '彩色云朵',
                category: 'nature',
                defaultSize: 70,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 云朵层次
                    const colors = ['#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8'];
                    const circles = [
                        { x: -size/3, y: 0, r: size/3, color: colors[0] },
                        { x: 0, y: -size/8, r: size/2.5, color: colors[1] },
                        { x: size/3, y: 0, r: size/3, color: colors[2] },
                        { x: 0, y: size/8, r: size/2.2, color: colors[3] }
                    ];
                    
                    circles.forEach(circle => {
                        ctx.fillStyle = circle.color;
                        ctx.beginPath();
                        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    ctx.restore();
                }
            },
            
            coloredRainbow: {
                name: '彩虹',
                category: 'nature',
                defaultSize: 100,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    const colors = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
                    const bandWidth = size / 14;
                    
                    colors.forEach((color, i) => {
                        ctx.strokeStyle = color;
                        ctx.lineWidth = bandWidth;
                        ctx.beginPath();
                        ctx.arc(0, size/3, size/2 - i * bandWidth, Math.PI, 0);
                        ctx.stroke();
                    });
                    
                    ctx.restore();
                }
            },
            
            coloredTree: {
                name: '彩色树',
                category: 'nature',
                defaultSize: 90,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 树干
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(-size/10, size/4, size/5, size/3);
                    
                    // 树叶层次
                    const leafColors = ['#228B22', '#32CD32', '#00FF00'];
                    const leafCircles = [
                        { x: 0, y: -size/4, r: size/3 },
                        { x: -size/4, y: 0, r: size/4 },
                        { x: size/4, y: 0, r: size/4 },
                        { x: 0, y: size/6, r: size/3.5 }
                    ];
                    
                    leafCircles.forEach((circle, i) => {
                        ctx.fillStyle = leafColors[i % leafColors.length];
                        ctx.beginPath();
                        ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    // 装饰果实
                    const fruits = [
                        { x: -size/5, y: -size/6, color: '#FF69B4' },
                        { x: size/5, y: -size/8, color: '#FFD700' },
                        { x: 0, y: size/8, color: '#FF1493' }
                    ];
                    
                    fruits.forEach(fruit => {
                        ctx.fillStyle = fruit.color;
                        ctx.beginPath();
                        ctx.arc(fruit.x, fruit.y, size/15, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    
                    ctx.restore();
                }
            },
            
            // 动物类贴纸
            coloredButterfly: {
                name: '彩色蝴蝶',
                category: 'animals',
                defaultSize: 60,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 身体
                    ctx.fillStyle = '#333';
                    ctx.fillRect(-size/20, -size/3, size/10, size/1.5);
                    
                    // 翅膀
                    const wingColors = ['#FF69B4', '#FFD700'];
                    
                    // 左翅膀
                    ctx.fillStyle = wingColors[0];
                    ctx.beginPath();
                    ctx.ellipse(-size/3, -size/6, size/3, size/4, -Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(-size/4, size/6, size/4, size/5, Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 右翅膀
                    ctx.fillStyle = wingColors[0];
                    ctx.beginPath();
                    ctx.ellipse(size/3, -size/6, size/3, size/4, Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.ellipse(size/4, size/6, size/4, size/5, -Math.PI/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 翅膀装饰
                    ctx.fillStyle = '#FFF';
                    ctx.beginPath();
                    ctx.arc(-size/3, -size/6, size/12, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(size/3, -size/6, size/12, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#FF1493';
                    ctx.beginPath();
                    ctx.arc(-size/5, size/6, size/15, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(size/5, size/6, size/15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            
            coloredBird: {
                name: '彩色小鸟',
                category: 'animals',
                defaultSize: 50,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 身体
                    ctx.fillStyle = '#00CED1';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, size/2, size/3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 头部
                    ctx.fillStyle = '#00BFFF';
                    ctx.beginPath();
                    ctx.arc(-size/4, -size/6, size/4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 翅膀
                    ctx.fillStyle = '#1E90FF';
                    ctx.save();
                    ctx.rotate(Math.PI/12);
                    ctx.beginPath();
                    ctx.ellipse(size/5, 0, size/3, size/5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    
                    // 眼睛
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(-size/3, -size/6, size/20, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#FFF';
                    ctx.beginPath();
                    ctx.arc(-size/3, -size/6, size/40, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 喙
                    ctx.fillStyle = '#FFA500';
                    ctx.beginPath();
                    ctx.moveTo(-size/2, -size/6);
                    ctx.lineTo(-size/1.7, -size/8);
                    ctx.lineTo(-size/1.7, -size/12);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 尾巴
                    ctx.fillStyle = '#4169E1';
                    ctx.beginPath();
                    ctx.moveTo(size/3, 0);
                    ctx.lineTo(size/1.5, size/8);
                    ctx.lineTo(size/1.5, -size/8);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            
            // 物品类贴纸
            coloredBalloon: {
                name: '彩色气球',
                category: 'objects',
                defaultSize: 65,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 绳子
                    ctx.strokeStyle = '#666';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, size/3);
                    ctx.lineTo(0, size);
                    ctx.stroke();
                    
                    // 气球
                    ctx.fillStyle = '#FF1493';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, size/2, size/1.6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 高光
                    ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
                    ctx.beginPath();
                    ctx.ellipse(-size/6, -size/4, size/5, size/3.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            
            coloredStar: {
                name: '彩色星星',
                category: 'objects',
                defaultSize: 50,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 星星主体
                    ctx.fillStyle = '#FFD700';
                    ctx.strokeStyle = '#FFA500';
                    ctx.lineWidth = 2;
                    
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        const angle = (Math.PI * 2 / 5) * i - Math.PI/2;
                        const innerAngle = angle + Math.PI/5;
                        const outerX = Math.cos(angle) * size/2;
                        const outerY = Math.sin(angle) * size/2;
                        const innerX = Math.cos(innerAngle) * size/4;
                        const innerY = Math.sin(innerAngle) * size/4;
                        
                        if (i === 0) {
                            ctx.moveTo(outerX, outerY);
                        } else {
                            ctx.lineTo(outerX, outerY);
                        }
                        ctx.lineTo(innerX, innerY);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                    
                    // 内部装饰
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        const angle = (Math.PI * 2 / 5) * i - Math.PI/2;
                        const innerAngle = angle + Math.PI/5;
                        const outerX = Math.cos(angle) * size/3;
                        const outerY = Math.sin(angle) * size/3;
                        const innerX = Math.cos(innerAngle) * size/6;
                        const innerY = Math.sin(innerAngle) * size/6;
                        
                        if (i === 0) {
                            ctx.moveTo(outerX, outerY);
                        } else {
                            ctx.lineTo(outerX, outerY);
                        }
                        ctx.lineTo(innerX, innerY);
                    }
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            
            coloredHeart: {
                name: '彩色爱心',
                category: 'objects',
                defaultSize: 45,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    ctx.fillStyle = '#FF1493';
                    ctx.beginPath();
                    
                    // 绘制心形
                    const width = size;
                    const height = size;
                    ctx.moveTo(0, height/4);
                    ctx.bezierCurveTo(-width/2, -height/4, -width, height/4, 0, height);
                    ctx.bezierCurveTo(width, height/4, width/2, -height/4, 0, height/4);
                    ctx.fill();
                    
                    // 高光效果
                    ctx.fillStyle = 'rgba(255, 105, 180, 0.5)';
                    ctx.beginPath();
                    ctx.ellipse(-width/4, 0, width/4, height/3, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.restore();
                }
            },
            
            // 装饰类贴纸
            coloredSparkle: {
                name: '闪光',
                category: 'decorations',
                defaultSize: 35,
                render: (ctx, x, y, size) => {
                    ctx.save();
                    
                    // 主星光
                    ctx.fillStyle = '#FFD700';
                    ctx.beginPath();
                    ctx.moveTo(0, -size/2);
                    ctx.lineTo(size/8, -size/8);
                    ctx.lineTo(size/2, 0);
                    ctx.lineTo(size/8, size/8);
                    ctx.lineTo(0, size/2);
                    ctx.lineTo(-size/8, size/8);
                    ctx.lineTo(-size/2, 0);
                    ctx.lineTo(-size/8, -size/8);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 旋转的小星光
                    ctx.save();
                    ctx.rotate(Math.PI/4);
                    ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
                    ctx.beginPath();
                    ctx.moveTo(0, -size/3);
                    ctx.lineTo(size/12, -size/12);
                    ctx.lineTo(size/3, 0);
                    ctx.lineTo(size/12, size/12);
                    ctx.lineTo(0, size/3);
                    ctx.lineTo(-size/12, size/12);
                    ctx.lineTo(-size/3, 0);
                    ctx.lineTo(-size/12, -size/12);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                    
                    ctx.restore();
                }
            }
        };
        
        // 初始化贴纸面板 - 必须在 stickerTemplates 定义之后
        this.initStickerPanel();
        
        // 初始化鼠标和触摸事件
        this.initMouseAndTouchEvents();
    }
    
    // 初始化贴纸面板
    initStickerPanel() {
        // 创建贴纸面板容器
        const panel = document.createElement('div');
        panel.id = 'stickerPanel';
        panel.className = 'sticker-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 7;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            display: none;
            max-width: 400px;
        `;
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '🎨 贴纸';
        title.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 16px;';
        panel.appendChild(title);
        
        // 创建贴纸网格
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            max-height: 300px;
            overflow-y: auto;
            padding: 10px 0;
        `;
        
        // 添加贴纸选项
        Object.keys(this.stickerTemplates).forEach(stickerId => {
            const sticker = this.stickerTemplates[stickerId];
            const btn = document.createElement('button');
            btn.className = 'sticker-btn';
            btn.style.cssText = `
                width: 70px;
                height: 70px;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                padding: 5px;
            `;
            
            // 创建预览canvas
            const previewCanvas = document.createElement('canvas');
            previewCanvas.width = 60;
            previewCanvas.height = 60;
            const previewCtx = previewCanvas.getContext('2d');
            
            // 绘制预览
            sticker.render(previewCtx, 30, 30, 25);
            
            btn.appendChild(previewCanvas);
            
            // 添加名称标签
            const label = document.createElement('div');
            label.textContent = sticker.name;
            label.style.cssText = `
                position: absolute;
                bottom: 2px;
                left: 0;
                right: 0;
                font-size: 9px;
                text-align: center;
                color: #666;
                background: rgba(255,255,255,0.9);
                padding: 1px;
            `;
            btn.appendChild(label);
            
            btn.onclick = () => this.addSticker(stickerId);
            
            btn.onmouseover = () => {
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                btn.style.borderColor = '#667eea';
            };
            
            btn.onmouseout = () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
                btn.style.borderColor = '#e0e0e0';
            };
            
            grid.appendChild(btn);
        });
        
        panel.appendChild(grid);
        
        // 创建说明文字
        const hint = document.createElement('p');
        hint.textContent = '💡 点击贴纸添加到画布，使用三指手势抓取和移动贴纸';
        hint.style.cssText = 'margin: 10px 0 0 0; font-size: 12px; color: #666;';
        panel.appendChild(hint);
        
        document.body.appendChild(panel);
        
        // 创建切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'stickerToggleBtn';
        toggleBtn.innerHTML = '🎨 贴纸';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 6;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        `;
        
        toggleBtn.onclick = () => {
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
            toggleBtn.style.display = isVisible ? 'block' : 'none';
        };
        
        toggleBtn.onmouseover = () => {
            toggleBtn.style.transform = 'translateY(-2px) scale(1.05)';
            toggleBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
        };
        
        toggleBtn.onmouseout = () => {
            toggleBtn.style.transform = 'translateY(0) scale(1)';
            toggleBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        };
        
        document.body.appendChild(toggleBtn);
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 25px;
            height: 25px;
            border: none;
            background: #e0e0e0;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        closeBtn.onclick = () => {
            panel.style.display = 'none';
            toggleBtn.style.display = 'block';
        };
        
        panel.appendChild(closeBtn);
    }
    
    // 添加贴纸
    addSticker(templateId, x = null, y = null) {
        const template = this.stickerTemplates[templateId];
        if (!template) {
            console.error('贴纸模板不存在:', templateId);
            return;
        }
        
        const sticker = {
            id: this.stickerIdCounter++,
            templateId: templateId,
            x: x || this.canvas.width / 2,
            y: y || this.canvas.height / 2,
            size: template.defaultSize,
            rotation: 0,
            isDragging: false
        };
        
        console.log('添加贴纸:', sticker);
        this.stickers.push(sticker);
        this.render();
        this.updatePointerEvents();
        
        // 关闭贴纸面板
        const panel = document.getElementById('stickerPanel');
        const toggleBtn = document.getElementById('stickerToggleBtn');
        if (panel && toggleBtn) {
            panel.style.display = 'none';
            toggleBtn.style.display = 'block';
        }
    }
    
    // 获取指定位置的贴纸
    getStickerAt(x, y) {
        // 从后往前遍历（后添加的在上层）
        for (let i = this.stickers.length - 1; i >= 0; i--) {
            const sticker = this.stickers[i];
            const halfSize = sticker.size / 2;
            
            // 简单的边界框检测
            if (x >= sticker.x - halfSize && x <= sticker.x + halfSize &&
                y >= sticker.y - halfSize && y <= sticker.y + halfSize) {
                return sticker;
            }
        }
        return null;
    }
    
    // 开始拖拽贴纸
    startDragging(x, y) {
        const sticker = this.getStickerAt(x, y);
        if (sticker) {
            this.draggedSticker = sticker;
            sticker.isDragging = true;
            this.render();
            return true;
        }
        return false;
    }
    
    // 移动贴纸
    moveSticker(x, y) {
        if (this.draggedSticker) {
            this.draggedSticker.x = x;
            this.draggedSticker.y = y;
            this.render();
        }
    }
    
    // 结束拖拽
    stopDragging() {
        if (this.draggedSticker) {
            this.draggedSticker.isDragging = false;
            this.draggedSticker = null;
            this.render();
        }
    }
    
    // 删除贴纸
    removeSticker(sticker) {
        const index = this.stickers.indexOf(sticker);
        if (index > -1) {
            this.stickers.splice(index, 1);
            this.render();
            this.updatePointerEvents();
        }
    }
    
    // 清空所有贴纸
    clearAll() {
        this.stickers = [];
        this.draggedSticker = null;
        this.render();
        this.updatePointerEvents();
    }
    
    // 更新指针事件状态
    updatePointerEvents() {
        // 只有在有贴纸时才启用指针事件
        if (this.stickers.length > 0) {
            this.canvas.style.pointerEvents = 'auto';
        } else {
            this.canvas.style.pointerEvents = 'none';
        }
    }
    
    // 初始化鼠标和触摸事件
    initMouseAndTouchEvents() {
        // 默认禁用指针事件，只有在有贴纸时才启用
        this.updatePointerEvents();
        
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        console.log('鼠标和触摸事件已初始化');
    }
    
    // 鼠标事件处理
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.startDragging(x, y)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    handleMouseMove(e) {
        if (this.draggedSticker) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.moveSticker(x, y);
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    handleMouseUp(e) {
        if (this.draggedSticker) {
            this.stopDragging();
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    // 触摸事件处理
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            if (this.startDragging(x, y)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
    
    handleTouchMove(e) {
        if (this.draggedSticker && e.touches.length === 1) {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.moveSticker(x, y);
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    handleTouchEnd(e) {
        if (this.draggedSticker) {
            this.stopDragging();
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    // 渲染所有贴纸
    render() {
        // 检查 canvas 是否有效
        if (!this.canvas || !this.ctx) {
            console.error('Canvas 或 Context 不存在');
            return;
        }
        
        console.log(`渲染 ${this.stickers.length} 个贴纸, canvas尺寸: ${this.canvas.width}x${this.canvas.height}`);
        
        // 清空贴纸层
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 渲染每个贴纸
        this.stickers.forEach(sticker => {
            const template = this.stickerTemplates[sticker.templateId];
            if (!template) return;
            
            this.ctx.save();
            
            // 应用变换
            this.ctx.translate(sticker.x, sticker.y);
            if (sticker.rotation) {
                this.ctx.rotate(sticker.rotation);
            }
            
            // 如果正在拖拽，添加边框
            if (sticker.isDragging) {
                this.ctx.strokeStyle = '#667eea';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.strokeRect(-sticker.size/2 - 5, -sticker.size/2 - 5, 
                                  sticker.size + 10, sticker.size + 10);
                this.ctx.setLineDash([]);
            }
            
            // 渲染贴纸 - 直接调用render函数，传入(0, 0)因为已经translate
            try {
                template.render(this.ctx, 0, 0, sticker.size);
                console.log(`贴纸 ${sticker.templateId} 渲染完成在位置:`, sticker.x, sticker.y);
            } catch (error) {
                console.error(`渲染贴纸 ${sticker.templateId} 失败:`, error);
            }
            
            this.ctx.restore();
        });
    }
}

// 导出到全局
window.StickerSystem = StickerSystem;