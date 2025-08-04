// 画笔工具系统
class BrushSystem {
    constructor(ctx) {
        this.ctx = ctx;
        this.currentBrush = 'watercolor';
        this.brushes = {
            // 马克笔
            marker: {
                name: '马克笔',
                icon: '🖍️',
                draw: this.drawMarker.bind(this),
                params: {
                    opacity: 0.9,
                    smoothness: 0.8,
                    capStyle: 'round',
                    joinStyle: 'round'
                }
            },
            // 彩色铅笔
            coloredPencil: {
                name: '彩色铅笔',
                icon: '✏️',
                draw: this.drawColoredPencil.bind(this),
                params: {
                    opacity: 0.7,
                    texture: true,
                    pressure: 0.5
                }
            },
            // 水彩笔
            watercolor: {
                name: '水彩笔',
                icon: '🎨',
                draw: this.drawWatercolor.bind(this),
                params: {
                    opacity: 0.4,
                    wetness: 0.6,
                    spread: 1.2,
                    blend: true
                }
            },
            // 铅笔
            pencil: {
                name: '铅笔',
                icon: '✎',
                draw: this.drawPencil.bind(this),
                params: {
                    opacity: 0.6,
                    hardness: 0.5,
                    texture: true
                }
            },
            // 喷漆
            spray: {
                name: '喷漆',
                icon: '🎯',
                draw: this.drawSpray.bind(this),
                params: {
                    opacity: 0.3,
                    density: 30,
                    scatter: 2
                }
            },
            // 滚刷
            roller: {
                name: '滚刷',
                icon: '🔲',
                draw: this.drawRoller.bind(this),
                params: {
                    opacity: 0.95,
                    width: 30,
                    texture: false
                }
            },
            // 蜡笔
            crayon: {
                name: '蜡笔',
                icon: '🖍️',
                draw: this.drawCrayon.bind(this),
                params: {
                    opacity: 0.8,
                    texture: true,
                    roughness: 0.7
                }
            },
            // 色粉
            pastel: {
                name: '色粉',
                icon: '🎨',
                draw: this.drawPastel.bind(this),
                params: {
                    opacity: 0.5,
                    softness: 0.8,
                    blend: true,
                    texture: true
                }
            },
            // 橡皮擦
            eraser: {
                name: '橡皮擦',
                icon: '🧹',
                draw: this.drawEraser.bind(this),
                params: {
                    hardness: 0.9
                }
            }
        };
        
        // 绘制历史记录用于某些效果
        this.strokeHistory = [];
        this.currentStroke = [];
    }
    
    // 设置当前画笔
    setBrush(brushType) {
        if (this.brushes[brushType]) {
            this.currentBrush = brushType;
            // 强制重置合成模式，防止橡皮擦模式残留
            this.ctx.globalCompositeOperation = 'source-over';
            return true;
        }
        return false;
    }
    
    // 获取当前画笔信息
    getCurrentBrush() {
        return this.brushes[this.currentBrush];
    }
    
    // 开始新的笔画
    startStroke(x, y, color, size) {
        this.currentStroke = [{x, y}];
        this.strokeStarted = true;
    }
    
    // 绘制笔画
    drawStroke(x1, y1, x2, y2, color, size) {
        const brush = this.brushes[this.currentBrush];
        if (brush && brush.draw) {
            // 每次绘制前确保重置合成模式（除非是橡皮擦）
            if (this.currentBrush !== 'eraser') {
                this.ctx.globalCompositeOperation = 'source-over';
            }
            brush.draw(x1, y1, x2, y2, color, size);
            this.currentStroke.push({x: x2, y: y2});
        }
    }
    
    // 结束笔画
    endStroke() {
        if (this.currentStroke.length > 0) {
            this.strokeHistory.push([...this.currentStroke]);
            this.currentStroke = [];
        }
        this.strokeStarted = false;
    }
    
    // 马克笔效果
    drawMarker(x1, y1, x2, y2, color, size) {
        const params = this.brushes.marker.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = params.opacity;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = size;
        this.ctx.lineCap = params.capStyle;
        this.ctx.lineJoin = params.joinStyle;
        
        // 平滑的线条
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        
        // 使用贝塞尔曲线使线条更平滑
        const cpx = (x1 + x2) / 2;
        const cpy = (y1 + y2) / 2;
        this.ctx.quadraticCurveTo(x1, y1, cpx, cpy);
        this.ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    // 彩色铅笔效果
    drawColoredPencil(x1, y1, x2, y2, color, size) {
        const params = this.brushes.coloredPencil.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = params.opacity;
        this.ctx.strokeStyle = color;
        
        // 创建纹理效果
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const steps = Math.max(Math.floor(distance / 2), 1);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            // 添加随机纹理
            for (let j = 0; j < 3; j++) {
                const offsetX = (Math.random() - 0.5) * size * 0.3;
                const offsetY = (Math.random() - 0.5) * size * 0.3;
                
                this.ctx.beginPath();
                this.ctx.arc(x + offsetX, y + offsetY, size * 0.2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
    
    // 水彩笔效果
    drawWatercolor(x1, y1, x2, y2, color, size) {
        const params = this.brushes.watercolor.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        
        // 解析颜色并创建渐变
        const gradient = this.ctx.createRadialGradient(x2, y2, 0, x2, y2, size * params.spread);
        
        // 添加透明度渐变
        const rgb = this.hexToRgb(color);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${params.opacity})`);
        gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${params.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
        
        this.ctx.fillStyle = gradient;
        
        // 绘制水彩晕染效果
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const steps = Math.max(Math.floor(distance / 3), 1);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size * params.spread, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    // 铅笔效果
    drawPencil(x1, y1, x2, y2, color, size) {
        const params = this.brushes.pencil.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = params.opacity;
        this.ctx.strokeStyle = color;
        
        // 创建铅笔纹理
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const steps = Math.max(Math.floor(distance), 1);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            // 模拟铅笔的不规则纹理
            this.ctx.beginPath();
            const variation = Math.random() * 0.5 + 0.5;
            this.ctx.arc(x, y, size * 0.3 * variation, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加细线条
            if (Math.random() > 0.7) {
                this.ctx.beginPath();
                this.ctx.moveTo(x - size/2, y);
                this.ctx.lineTo(x + size/2, y);
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    // 喷漆效果
    drawSpray(x1, y1, x2, y2, color, size) {
        const params = this.brushes.spray.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = params.opacity;
        
        // 创建喷溅效果
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const steps = Math.max(Math.floor(distance / 2), 1);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const centerX = x1 + (x2 - x1) * t;
            const centerY = y1 + (y2 - y1) * t;
            
            // 生成随机粒子
            for (let j = 0; j < params.density; j++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * size * params.scatter;
                const particleX = centerX + Math.cos(angle) * radius;
                const particleY = centerY + Math.sin(angle) * radius;
                const particleSize = Math.random() * 2 + 0.5;
                
                this.ctx.beginPath();
                this.ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
    
    // 滚刷效果
    drawRoller(x1, y1, x2, y2, color, size) {
        const params = this.brushes.roller.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = params.opacity;
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = params.width || size * 3;
        this.ctx.lineCap = 'square';
        
        // 绘制粗线条
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    // 蜡笔效果
    drawCrayon(x1, y1, x2, y2, color, size) {
        const params = this.brushes.crayon.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = params.opacity;
        this.ctx.fillStyle = color;
        
        // 创建蜡笔的粗糙纹理
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const steps = Math.max(Math.floor(distance / 1.5), 1);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            // 创建不规则形状
            this.ctx.beginPath();
            const points = 6;
            for (let j = 0; j < points; j++) {
                const angle = (Math.PI * 2 / points) * j;
                const radius = size * (0.8 + Math.random() * 0.4);
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                
                if (j === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    // 色粉效果
    drawPastel(x1, y1, x2, y2, color, size) {
        const params = this.brushes.pastel.params;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = params.opacity;
        
        // 创建柔和的粉末效果
        const rgb = this.hexToRgb(color);
        const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const steps = Math.max(Math.floor(distance / 2), 1);
        
        for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            
            // 创建渐变圆形
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
            gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${params.opacity})`);
            gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${params.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 添加粉末颗粒
            for (let j = 0; j < 5; j++) {
                const offsetX = (Math.random() - 0.5) * size;
                const offsetY = (Math.random() - 0.5) * size;
                const particleSize = Math.random() * 2;
                
                this.ctx.fillStyle = color;
                this.ctx.globalAlpha = params.opacity * 0.3;
                this.ctx.beginPath();
                this.ctx.arc(x + offsetX, y + offsetY, particleSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
    
    // 橡皮擦效果
    drawEraser(x1, y1, x2, y2, color, size) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = size * 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    // 辅助函数：将十六进制颜色转换为RGB
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 255, g: 0, b: 0};
    }
}

// 导出到全局
window.BrushSystem = BrushSystem;