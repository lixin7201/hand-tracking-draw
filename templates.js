// 简笔画模板数据
const drawingTemplates = {
    animals: [
        {
            id: 'cat',
            name: '小猫',
            icon: '🐱',
            paths: [
                // 头部轮廓
                { type: 'ellipse', x: 400, y: 300, rx: 80, ry: 70, fill: false },
                // 耳朵
                { type: 'triangle', points: [[340, 270], [320, 220], [360, 240]], fill: false },
                { type: 'triangle', points: [[460, 270], [480, 220], [440, 240]], fill: false },
                // 眼睛
                { type: 'circle', x: 370, y: 290, r: 8, fill: true },
                { type: 'circle', x: 430, y: 290, r: 8, fill: true },
                // 鼻子
                { type: 'triangle', points: [[400, 310], [390, 320], [410, 320]], fill: true },
                // 嘴巴
                { type: 'arc', x: 380, y: 320, r: 20, start: 0, end: Math.PI/2, fill: false },
                { type: 'arc', x: 420, y: 320, r: 20, start: Math.PI/2, end: Math.PI, fill: false },
                // 胡须
                { type: 'line', x1: 300, y1: 300, x2: 350, y2: 295 },
                { type: 'line', x1: 300, y1: 310, x2: 350, y2: 310 },
                { type: 'line', x1: 450, y1: 295, x2: 500, y2: 300 },
                { type: 'line', x1: 450, y1: 310, x2: 500, y2: 310 },
                // 身体
                { type: 'ellipse', x: 400, y: 420, rx: 70, ry: 90, fill: false },
                // 尾巴
                { type: 'bezier', points: [[470, 420], [550, 400], [540, 320], [500, 280]], fill: false },
                // 脚
                { type: 'ellipse', x: 360, y: 490, rx: 20, ry: 30, fill: false },
                { type: 'ellipse', x: 440, y: 490, rx: 20, ry: 30, fill: false }
            ]
        },
        {
            id: 'dog',
            name: '小狗',
            icon: '🐶',
            paths: [
                // 头部
                { type: 'circle', x: 400, y: 300, r: 70, fill: false },
                // 耳朵
                { type: 'ellipse', x: 340, y: 280, rx: 25, ry: 50, fill: false },
                { type: 'ellipse', x: 460, y: 280, rx: 25, ry: 50, fill: false },
                // 眼睛
                { type: 'circle', x: 375, y: 290, r: 10, fill: true },
                { type: 'circle', x: 425, y: 290, r: 10, fill: true },
                // 鼻子
                { type: 'ellipse', x: 400, y: 320, rx: 12, ry: 8, fill: true },
                // 嘴巴
                { type: 'arc', x: 400, y: 330, r: 25, start: 0, end: Math.PI, fill: false },
                // 身体
                { type: 'ellipse', x: 400, y: 430, rx: 80, ry: 100, fill: false },
                // 尾巴
                { type: 'bezier', points: [[480, 430], [550, 450], [560, 380], [540, 340]], fill: false },
                // 腿
                { type: 'rect', x: 350, y: 480, width: 30, height: 60, fill: false },
                { type: 'rect', x: 420, y: 480, width: 30, height: 60, fill: false },
                // 项圈
                { type: 'rect', x: 330, y: 360, width: 140, height: 20, fill: false }
            ]
        },
        {
            id: 'rabbit',
            name: '小兔子',
            icon: '🐰',
            paths: [
                // 头部
                { type: 'circle', x: 400, y: 320, r: 60, fill: false },
                // 长耳朵
                { type: 'ellipse', x: 370, y: 250, rx: 20, ry: 60, fill: false },
                { type: 'ellipse', x: 430, y: 250, rx: 20, ry: 60, fill: false },
                // 耳朵内部
                { type: 'ellipse', x: 370, y: 250, rx: 10, ry: 40, fill: false },
                { type: 'ellipse', x: 430, y: 250, rx: 10, ry: 40, fill: false },
                // 眼睛
                { type: 'circle', x: 380, y: 310, r: 8, fill: true },
                { type: 'circle', x: 420, y: 310, r: 8, fill: true },
                // 鼻子
                { type: 'circle', x: 400, y: 330, r: 5, fill: true },
                // 嘴巴
                { type: 'line', x1: 400, y1: 330, x2: 400, y2: 340 },
                { type: 'arc', x: 390, y: 340, r: 10, start: 0, end: Math.PI/2, fill: false },
                { type: 'arc', x: 410, y: 340, r: 10, start: Math.PI/2, end: Math.PI, fill: false },
                // 身体
                { type: 'ellipse', x: 400, y: 440, rx: 70, ry: 90, fill: false },
                // 尾巴
                { type: 'circle', x: 470, y: 460, r: 25, fill: false },
                // 脚
                { type: 'ellipse', x: 360, y: 510, rx: 25, ry: 35, fill: false },
                { type: 'ellipse', x: 440, y: 510, rx: 25, ry: 35, fill: false },
                // 前爪
                { type: 'circle', x: 360, y: 420, r: 15, fill: false },
                { type: 'circle', x: 440, y: 420, r: 15, fill: false }
            ]
        },
        {
            id: 'fish',
            name: '小鱼',
            icon: '🐠',
            paths: [
                // 身体
                { type: 'ellipse', x: 400, y: 300, rx: 100, ry: 60, fill: false },
                // 尾巴
                { type: 'triangle', points: [[500, 300], [560, 260], [560, 340]], fill: false },
                // 眼睛
                { type: 'circle', x: 350, y: 290, r: 15, fill: false },
                { type: 'circle', x: 350, y: 290, r: 8, fill: true },
                // 嘴巴
                { type: 'arc', x: 300, y: 300, r: 20, start: -Math.PI/4, end: Math.PI/4, fill: false },
                // 背鳍
                { type: 'triangle', points: [[380, 240], [420, 240], [400, 200]], fill: false },
                // 腹鳍
                { type: 'triangle', points: [[380, 350], [380, 380], [410, 360]], fill: false },
                // 鱼鳞装饰
                { type: 'arc', x: 400, y: 280, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'arc', x: 430, y: 280, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'arc', x: 400, y: 310, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'arc', x: 430, y: 310, r: 15, start: 0, end: Math.PI, fill: false }
            ]
        },
        {
            id: 'butterfly',
            name: '蝴蝶',
            icon: '🦋',
            paths: [
                // 身体
                { type: 'ellipse', x: 400, y: 350, rx: 15, ry: 50, fill: false },
                // 头部
                { type: 'circle', x: 400, y: 290, r: 20, fill: false },
                // 触角
                { type: 'line', x1: 390, y1: 280, x2: 380, y2: 260 },
                { type: 'line', x1: 410, y1: 280, x2: 420, y2: 260 },
                { type: 'circle', x: 380, y: 260, r: 5, fill: true },
                { type: 'circle', x: 420, y: 260, r: 5, fill: true },
                // 左上翅膀
                { type: 'bezier', points: [[385, 320], [320, 280], [300, 320], [340, 360], [385, 350]], fill: false },
                // 右上翅膀
                { type: 'bezier', points: [[415, 320], [480, 280], [500, 320], [460, 360], [415, 350]], fill: false },
                // 左下翅膀
                { type: 'bezier', points: [[385, 360], [340, 380], [330, 420], [360, 410], [385, 380]], fill: false },
                // 右下翅膀
                { type: 'bezier', points: [[415, 360], [460, 380], [470, 420], [440, 410], [415, 380]], fill: false },
                // 翅膀装饰
                { type: 'circle', x: 340, y: 320, r: 15, fill: false },
                { type: 'circle', x: 460, y: 320, r: 15, fill: false },
                { type: 'circle', x: 350, y: 380, r: 10, fill: false },
                { type: 'circle', x: 450, y: 380, r: 10, fill: false }
            ]
        }
    ],
    plants: [
        {
            id: 'flower',
            name: '向日葵',
            icon: '🌻',
            paths: [
                // 花心
                { type: 'circle', x: 400, y: 250, r: 40, fill: false },
                // 花瓣
                { type: 'ellipse', x: 400, y: 180, rx: 20, ry: 35, fill: false },
                { type: 'ellipse', x: 450, y: 200, rx: 20, ry: 35, fill: false, rotate: 45 },
                { type: 'ellipse', x: 470, y: 250, rx: 20, ry: 35, fill: false, rotate: 90 },
                { type: 'ellipse', x: 450, y: 300, rx: 20, ry: 35, fill: false, rotate: 135 },
                { type: 'ellipse', x: 400, y: 320, rx: 20, ry: 35, fill: false },
                { type: 'ellipse', x: 350, y: 300, rx: 20, ry: 35, fill: false, rotate: -135 },
                { type: 'ellipse', x: 330, y: 250, rx: 20, ry: 35, fill: false, rotate: -90 },
                { type: 'ellipse', x: 350, y: 200, rx: 20, ry: 35, fill: false, rotate: -45 },
                // 茎
                { type: 'line', x1: 400, y1: 290, x2: 400, y2: 480 },
                { type: 'line', x1: 395, y1: 290, x2: 395, y2: 480 },
                { type: 'line', x1: 405, y1: 290, x2: 405, y2: 480 },
                // 叶子
                { type: 'bezier', points: [[400, 380], [340, 360], [330, 400], [380, 400]], fill: false },
                { type: 'bezier', points: [[400, 420], [460, 400], [470, 440], [420, 440]], fill: false }
            ]
        },
        {
            id: 'tree',
            name: '大树',
            icon: '🌳',
            paths: [
                // 树干
                { type: 'rect', x: 380, y: 400, width: 40, height: 120, fill: false },
                // 树冠
                { type: 'circle', x: 400, y: 280, r: 80, fill: false },
                { type: 'circle', x: 350, y: 300, r: 60, fill: false },
                { type: 'circle', x: 450, y: 300, r: 60, fill: false },
                { type: 'circle', x: 400, y: 330, r: 70, fill: false },
                // 树枝纹理
                { type: 'line', x1: 390, y1: 450, x2: 370, y2: 430 },
                { type: 'line', x1: 410, y1: 460, x2: 430, y2: 440 },
                // 果实
                { type: 'circle', x: 380, y: 290, r: 8, fill: false },
                { type: 'circle', x: 420, y: 310, r: 8, fill: false },
                { type: 'circle', x: 360, y: 330, r: 8, fill: false },
                { type: 'circle', x: 440, y: 340, r: 8, fill: false },
                // 草地
                { type: 'line', x1: 300, y1: 520, x2: 500, y2: 520 }
            ]
        },
        {
            id: 'cactus',
            name: '仙人掌',
            icon: '🌵',
            paths: [
                // 主干
                { type: 'ellipse', x: 400, y: 380, rx: 50, ry: 120, fill: false },
                // 左臂
                { type: 'ellipse', x: 320, y: 350, rx: 30, ry: 60, fill: false },
                // 右臂
                { type: 'ellipse', x: 480, y: 330, rx: 30, ry: 70, fill: false },
                // 花朵
                { type: 'circle', x: 400, y: 260, r: 15, fill: false },
                { type: 'circle', x: 400, y: 260, r: 8, fill: false },
                // 刺
                { type: 'line', x1: 380, y1: 340, x2: 375, y2: 335 },
                { type: 'line', x1: 420, y1: 340, x2: 425, y2: 335 },
                { type: 'line', x1: 380, y1: 380, x2: 375, y2: 375 },
                { type: 'line', x1: 420, y1: 380, x2: 425, y2: 375 },
                { type: 'line', x1: 380, y1: 420, x2: 375, y2: 415 },
                { type: 'line', x1: 420, y1: 420, x2: 425, y2: 415 },
                { type: 'line', x1: 310, y1: 350, x2: 305, y2: 345 },
                { type: 'line', x1: 330, y1: 350, x2: 335, y2: 345 },
                { type: 'line', x1: 470, y1: 330, x2: 465, y2: 325 },
                { type: 'line', x1: 490, y1: 330, x2: 495, y2: 325 },
                // 花盆
                { type: 'rect', x: 350, y: 480, width: 100, height: 60, fill: false },
                { type: 'line', x1: 350, y1: 490, x2: 450, y2: 490 }
            ]
        },
        {
            id: 'mushroom',
            name: '蘑菇',
            icon: '🍄',
            paths: [
                // 菌盖
                { type: 'arc', x: 400, y: 300, r: 80, start: Math.PI, end: 0, fill: false },
                { type: 'line', x1: 320, y1: 300, x2: 480, y2: 300 },
                // 菌柄
                { type: 'rect', x: 370, y: 300, width: 60, height: 100, fill: false },
                // 菌盖斑点
                { type: 'circle', x: 380, y: 260, r: 12, fill: false },
                { type: 'circle', x: 420, y: 250, r: 10, fill: false },
                { type: 'circle', x: 360, y: 280, r: 8, fill: false },
                { type: 'circle', x: 440, y: 275, r: 11, fill: false },
                { type: 'circle', x: 400, y: 280, r: 9, fill: false },
                // 草地
                { type: 'line', x1: 300, y1: 400, x2: 340, y2: 400 },
                { type: 'line', x1: 460, y1: 400, x2: 500, y2: 400 },
                { type: 'line', x1: 320, y1: 410, x2: 350, y2: 410 },
                { type: 'line', x1: 450, y1: 410, x2: 480, y2: 410 }
            ]
        },
        {
            id: 'tulip',
            name: '郁金香',
            icon: '🌷',
            paths: [
                // 花朵
                { type: 'bezier', points: [[400, 250], [380, 200], [380, 180], [400, 200]], fill: false },
                { type: 'bezier', points: [[400, 200], [420, 180], [420, 200], [400, 250]], fill: false },
                { type: 'bezier', points: [[400, 250], [360, 200], [360, 180], [380, 200]], fill: false },
                { type: 'bezier', points: [[420, 200], [440, 180], [440, 200], [400, 250]], fill: false },
                // 茎
                { type: 'line', x1: 400, y1: 250, x2: 400, y2: 450 },
                { type: 'line', x1: 395, y1: 250, x2: 395, y2: 450 },
                { type: 'line', x1: 405, y1: 250, x2: 405, y2: 450 },
                // 叶子
                { type: 'bezier', points: [[400, 350], [350, 330], [340, 380], [390, 400]], fill: false },
                { type: 'bezier', points: [[400, 380], [450, 360], [460, 410], [410, 430]], fill: false }
            ]
        }
    ]
};

// 绘制模板的函数
function drawTemplate(ctx, template, scale = 1) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#333';
    
    template.paths.forEach(path => {
        ctx.save();
        
        switch(path.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(path.x * scale, path.y * scale, path.r * scale, 0, Math.PI * 2);
                if (path.fill) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
                break;
                
            case 'ellipse':
                ctx.beginPath();
                if (path.rotate) {
                    ctx.translate(path.x * scale, path.y * scale);
                    ctx.rotate(path.rotate * Math.PI / 180);
                    ctx.ellipse(0, 0, path.rx * scale, path.ry * scale, 0, 0, Math.PI * 2);
                    ctx.translate(-path.x * scale, -path.y * scale);
                } else {
                    ctx.ellipse(path.x * scale, path.y * scale, path.rx * scale, path.ry * scale, 0, 0, Math.PI * 2);
                }
                if (path.fill) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
                break;
                
            case 'rect':
                if (path.fill) {
                    ctx.fillRect(path.x * scale, path.y * scale, path.width * scale, path.height * scale);
                } else {
                    ctx.strokeRect(path.x * scale, path.y * scale, path.width * scale, path.height * scale);
                }
                break;
                
            case 'line':
                ctx.beginPath();
                ctx.moveTo(path.x1 * scale, path.y1 * scale);
                ctx.lineTo(path.x2 * scale, path.y2 * scale);
                ctx.stroke();
                break;
                
            case 'arc':
                ctx.beginPath();
                ctx.arc(path.x * scale, path.y * scale, path.r * scale, path.start, path.end);
                if (path.fill) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
                break;
                
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(path.points[0][0] * scale, path.points[0][1] * scale);
                ctx.lineTo(path.points[1][0] * scale, path.points[1][1] * scale);
                ctx.lineTo(path.points[2][0] * scale, path.points[2][1] * scale);
                ctx.closePath();
                if (path.fill) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
                break;
                
            case 'bezier':
                ctx.beginPath();
                ctx.moveTo(path.points[0][0] * scale, path.points[0][1] * scale);
                if (path.points.length === 4) {
                    ctx.bezierCurveTo(
                        path.points[1][0] * scale, path.points[1][1] * scale,
                        path.points[2][0] * scale, path.points[2][1] * scale,
                        path.points[3][0] * scale, path.points[3][1] * scale
                    );
                } else if (path.points.length === 5) {
                    // 多点贝塞尔曲线
                    for(let i = 1; i < path.points.length; i++) {
                        ctx.lineTo(path.points[i][0] * scale, path.points[i][1] * scale);
                    }
                    ctx.closePath();
                }
                if (path.fill) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
                break;
        }
        
        ctx.restore();
    });
}

// 导出
window.drawingTemplates = drawingTemplates;
window.drawTemplate = drawTemplate;