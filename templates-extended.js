// 扩展版简笔画模板数据 - 100个模板
const drawingTemplates = {
    animals: [
        // 1. 小猫
        {
            id: 'cat',
            name: '小猫',
            icon: '🐱',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 80, ry: 70, fill: false },
                { type: 'triangle', points: [[340, 270], [320, 220], [360, 240]], fill: false },
                { type: 'triangle', points: [[460, 270], [480, 220], [440, 240]], fill: false },
                { type: 'circle', x: 370, y: 290, r: 8, fill: true },
                { type: 'circle', x: 430, y: 290, r: 8, fill: true },
                { type: 'triangle', points: [[400, 310], [390, 320], [410, 320]], fill: true },
                { type: 'arc', x: 380, y: 320, r: 20, start: 0, end: Math.PI/2, fill: false },
                { type: 'arc', x: 420, y: 320, r: 20, start: Math.PI/2, end: Math.PI, fill: false }
            ]
        },
        // 2. 小狗
        {
            id: 'dog',
            name: '小狗',
            icon: '🐶',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 70, fill: false },
                { type: 'ellipse', x: 340, y: 280, rx: 25, ry: 50, fill: false },
                { type: 'ellipse', x: 460, y: 280, rx: 25, ry: 50, fill: false },
                { type: 'circle', x: 375, y: 290, r: 10, fill: true },
                { type: 'circle', x: 425, y: 290, r: 10, fill: true },
                { type: 'ellipse', x: 400, y: 320, rx: 12, ry: 8, fill: true }
            ]
        },
        // 3. 兔子
        {
            id: 'rabbit',
            name: '兔子',
            icon: '🐰',
            paths: [
                { type: 'ellipse', x: 400, y: 350, rx: 60, ry: 70, fill: false },
                { type: 'ellipse', x: 380, y: 250, rx: 15, ry: 50, fill: false },
                { type: 'ellipse', x: 420, y: 250, rx: 15, ry: 50, fill: false },
                { type: 'circle', x: 380, y: 340, r: 8, fill: true },
                { type: 'circle', x: 420, y: 340, r: 8, fill: true },
                { type: 'circle', x: 400, y: 360, r: 5, fill: true }
            ]
        },
        // 4. 小熊
        {
            id: 'bear',
            name: '小熊',
            icon: '🐻',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 80, fill: false },
                { type: 'circle', x: 350, y: 250, r: 25, fill: false },
                { type: 'circle', x: 450, y: 250, r: 25, fill: false },
                { type: 'circle', x: 370, y: 290, r: 8, fill: true },
                { type: 'circle', x: 430, y: 290, r: 8, fill: true },
                { type: 'ellipse', x: 400, y: 320, rx: 15, ry: 10, fill: true }
            ]
        },
        // 5. 大象
        {
            id: 'elephant',
            name: '大象',
            icon: '🐘',
            paths: [
                { type: 'ellipse', x: 400, y: 350, rx: 100, ry: 80, fill: false },
                { type: 'arc', x: 320, y: 350, r: 40, start: Math.PI, end: Math.PI*2, fill: false },
                { type: 'ellipse', x: 340, y: 280, rx: 40, ry: 30, fill: false },
                { type: 'ellipse', x: 460, y: 280, rx: 40, ry: 30, fill: false },
                { type: 'circle', x: 370, y: 330, r: 6, fill: true },
                { type: 'circle', x: 430, y: 330, r: 6, fill: true }
            ]
        },
        // 6. 小鸟
        {
            id: 'bird',
            name: '小鸟',
            icon: '🐦',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 50, ry: 40, fill: false },
                { type: 'circle', x: 430, y: 290, r: 25, fill: false },
                { type: 'triangle', points: [[450, 290], [470, 285], [470, 295]], fill: true },
                { type: 'circle', x: 440, y: 285, r: 5, fill: true },
                { type: 'ellipse', x: 360, y: 310, rx: 30, ry: 15, fill: false }
            ]
        },
        // 7. 小鱼
        {
            id: 'fish',
            name: '小鱼',
            icon: '🐠',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 70, ry: 40, fill: false },
                { type: 'triangle', points: [[480, 300], [520, 280], [520, 320]], fill: false },
                { type: 'circle', x: 360, y: 290, r: 8, fill: true },
                { type: 'arc', x: 350, y: 310, r: 15, start: 0, end: Math.PI, fill: false }
            ]
        },
        // 8. 蝴蝶
        {
            id: 'butterfly',
            name: '蝴蝶',
            icon: '🦋',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 10, ry: 30, fill: false },
                { type: 'ellipse', x: 370, y: 280, rx: 30, ry: 20, fill: false },
                { type: 'ellipse', x: 430, y: 280, rx: 30, ry: 20, fill: false },
                { type: 'ellipse', x: 370, y: 320, rx: 25, ry: 15, fill: false },
                { type: 'ellipse', x: 430, y: 320, rx: 25, ry: 15, fill: false }
            ]
        },
        // 9. 瓢虫
        {
            id: 'ladybug',
            name: '瓢虫',
            icon: '🐞',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 50, ry: 40, fill: false },
                { type: 'circle', x: 400, y: 260, r: 20, fill: false },
                { type: 'line', x1: 400, y1: 280, x2: 400, y2: 340 },
                { type: 'circle', x: 375, y: 290, r: 8, fill: true },
                { type: 'circle', x: 425, y: 290, r: 8, fill: true },
                { type: 'circle', x: 380, y: 320, r: 8, fill: true },
                { type: 'circle', x: 420, y: 320, r: 8, fill: true }
            ]
        },
        // 10. 蜜蜂
        {
            id: 'bee',
            name: '蜜蜂',
            icon: '🐝',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 40, ry: 30, fill: false },
                { type: 'ellipse', x: 360, y: 280, rx: 20, ry: 10, fill: false },
                { type: 'ellipse', x: 440, y: 280, rx: 20, ry: 10, fill: false },
                { type: 'line', x1: 380, y1: 290, x2: 380, y2: 310 },
                { type: 'line', x1: 400, y1: 290, x2: 400, y2: 310 },
                { type: 'line', x1: 420, y1: 290, x2: 420, y2: 310 }
            ]
        },
        // 11. 老鼠
        {
            id: 'mouse',
            name: '老鼠',
            icon: '🐭',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 45, ry: 35, fill: false },
                { type: 'circle', x: 370, y: 270, r: 15, fill: false },
                { type: 'circle', x: 430, y: 270, r: 15, fill: false },
                { type: 'circle', x: 380, y: 295, r: 5, fill: true },
                { type: 'circle', x: 420, y: 295, r: 5, fill: true },
                { type: 'bezier', points: [[445, 310], [500, 320], [520, 340], [500, 360]], fill: false }
            ]
        },
        // 12. 小猪
        {
            id: 'pig',
            name: '小猪',
            icon: '🐷',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 70, ry: 60, fill: false },
                { type: 'ellipse', x: 400, y: 320, rx: 25, ry: 15, fill: false },
                { type: 'circle', x: 390, y: 320, r: 4, fill: true },
                { type: 'circle', x: 410, y: 320, r: 4, fill: true },
                { type: 'circle', x: 375, y: 290, r: 6, fill: true },
                { type: 'circle', x: 425, y: 290, r: 6, fill: true }
            ]
        },
        // 13. 小鸡
        {
            id: 'chicken',
            name: '小鸡',
            icon: '🐤',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 50, fill: false },
                { type: 'triangle', points: [[400, 250], [390, 240], [410, 240]], fill: false },
                { type: 'triangle', points: [[395, 310], [405, 310], [400, 320]], fill: true },
                { type: 'circle', x: 385, y: 295, r: 5, fill: true },
                { type: 'circle', x: 415, y: 295, r: 5, fill: true }
            ]
        },
        // 14. 鸭子
        {
            id: 'duck',
            name: '鸭子',
            icon: '🦆',
            paths: [
                { type: 'ellipse', x: 400, y: 320, rx: 60, ry: 50, fill: false },
                { type: 'circle', x: 400, y: 270, r: 35, fill: false },
                { type: 'ellipse', x: 435, y: 270, rx: 20, ry: 10, fill: false },
                { type: 'circle', x: 385, y: 265, r: 5, fill: true },
                { type: 'circle', x: 415, y: 265, r: 5, fill: true }
            ]
        },
        // 15. 奶牛
        {
            id: 'cow',
            name: '奶牛',
            icon: '🐄',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 80, ry: 60, fill: false },
                { type: 'arc', x: 360, y: 250, r: 15, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 440, y: 250, r: 15, start: Math.PI, end: 0, fill: false },
                { type: 'circle', x: 375, y: 290, r: 8, fill: true },
                { type: 'circle', x: 425, y: 290, r: 8, fill: true },
                { type: 'ellipse', x: 400, y: 320, rx: 20, ry: 12, fill: false }
            ]
        },
        // 16. 马
        {
            id: 'horse',
            name: '马',
            icon: '🐴',
            paths: [
                { type: 'ellipse', x: 380, y: 300, rx: 60, ry: 50, fill: false },
                { type: 'ellipse', x: 450, y: 280, rx: 40, ry: 30, fill: false },
                { type: 'triangle', points: [[430, 260], [440, 240], [450, 260]], fill: false },
                { type: 'triangle', points: [[460, 260], [470, 240], [480, 260]], fill: false },
                { type: 'circle', x: 460, y: 275, r: 6, fill: true }
            ]
        },
        // 17. 绵羊
        {
            id: 'sheep',
            name: '绵羊',
            icon: '🐑',
            paths: [
                { type: 'circle', x: 380, y: 300, r: 25, fill: false },
                { type: 'circle', x: 410, y: 295, r: 25, fill: false },
                { type: 'circle', x: 440, y: 300, r: 25, fill: false },
                { type: 'circle', x: 420, y: 320, r: 25, fill: false },
                { type: 'circle', x: 390, y: 325, r: 25, fill: false },
                { type: 'circle', x: 410, y: 280, r: 20, fill: false }
            ]
        },
        // 18. 猴子
        {
            id: 'monkey',
            name: '猴子',
            icon: '🐵',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 60, fill: false },
                { type: 'circle', x: 350, y: 290, r: 20, fill: false },
                { type: 'circle', x: 450, y: 290, r: 20, fill: false },
                { type: 'circle', x: 380, y: 295, r: 8, fill: true },
                { type: 'circle', x: 420, y: 295, r: 8, fill: true },
                { type: 'arc', x: 400, y: 320, r: 20, start: 0, end: Math.PI, fill: false }
            ]
        },
        // 19. 狮子
        {
            id: 'lion',
            name: '狮子',
            icon: '🦁',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 70, fill: false },
                { type: 'circle', x: 400, y: 300, r: 90, fill: false },
                { type: 'triangle', points: [[370, 250], [380, 270], [360, 270]], fill: false },
                { type: 'triangle', points: [[430, 250], [420, 270], [440, 270]], fill: false },
                { type: 'circle', x: 380, y: 290, r: 6, fill: true },
                { type: 'circle', x: 420, y: 290, r: 6, fill: true }
            ]
        },
        // 20. 老虎
        {
            id: 'tiger',
            name: '老虎',
            icon: '🐯',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 70, fill: false },
                { type: 'triangle', points: [[360, 250], [370, 270], [350, 270]], fill: false },
                { type: 'triangle', points: [[440, 250], [430, 270], [450, 270]], fill: false },
                { type: 'line', x1: 350, y1: 280, x2: 350, y2: 300 },
                { type: 'line', x1: 450, y1: 280, x2: 450, y2: 300 },
                { type: 'line', x1: 360, y1: 285, x2: 360, y2: 305 },
                { type: 'line', x1: 440, y1: 285, x2: 440, y2: 305 }
            ]
        },
        // 21. 长颈鹿
        {
            id: 'giraffe',
            name: '长颈鹿',
            icon: '🦒',
            paths: [
                { type: 'ellipse', x: 400, y: 400, rx: 60, ry: 50, fill: false },
                { type: 'rect', x: 390, y: 250, width: 20, height: 150, fill: false },
                { type: 'circle', x: 400, y: 230, r: 30, fill: false },
                { type: 'line', x1: 390, y1: 210, x2: 385, y2: 195 },
                { type: 'line', x1: 410, y1: 210, x2: 415, y2: 195 }
            ]
        },
        // 22. 熊猫
        {
            id: 'panda',
            name: '熊猫',
            icon: '🐼',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 70, fill: false },
                { type: 'circle', x: 360, y: 260, r: 20, fill: true },
                { type: 'circle', x: 440, y: 260, r: 20, fill: true },
                { type: 'ellipse', x: 380, y: 290, rx: 15, ry: 20, fill: true },
                { type: 'ellipse', x: 420, y: 290, rx: 15, ry: 20, fill: true },
                { type: 'circle', x: 400, y: 320, r: 10, fill: true }
            ]
        },
        // 23. 考拉
        {
            id: 'koala',
            name: '考拉',
            icon: '🐨',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 60, ry: 70, fill: false },
                { type: 'circle', x: 355, y: 260, r: 30, fill: false },
                { type: 'circle', x: 445, y: 260, r: 30, fill: false },
                { type: 'circle', x: 380, y: 290, r: 6, fill: true },
                { type: 'circle', x: 420, y: 290, r: 6, fill: true },
                { type: 'ellipse', x: 400, y: 320, rx: 18, ry: 12, fill: true }
            ]
        },
        // 24. 企鹅
        {
            id: 'penguin',
            name: '企鹅',
            icon: '🐧',
            paths: [
                { type: 'ellipse', x: 400, y: 320, rx: 50, ry: 80, fill: false },
                { type: 'ellipse', x: 400, y: 340, rx: 35, ry: 60, fill: false },
                { type: 'ellipse', x: 350, y: 320, rx: 20, ry: 30, fill: false },
                { type: 'ellipse', x: 450, y: 320, rx: 20, ry: 30, fill: false },
                { type: 'circle', x: 385, y: 280, r: 5, fill: true },
                { type: 'circle', x: 415, y: 280, r: 5, fill: true }
            ]
        },
        // 25. 猫头鹰
        {
            id: 'owl',
            name: '猫头鹰',
            icon: '🦉',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 60, ry: 70, fill: false },
                { type: 'circle', x: 380, y: 285, r: 20, fill: false },
                { type: 'circle', x: 420, y: 285, r: 20, fill: false },
                { type: 'circle', x: 380, y: 285, r: 10, fill: true },
                { type: 'circle', x: 420, y: 285, r: 10, fill: true },
                { type: 'triangle', points: [[400, 310], [395, 320], [405, 320]], fill: true }
            ]
        },
        // 26. 狐狸
        {
            id: 'fox',
            name: '狐狸',
            icon: '🦊',
            paths: [
                { type: 'triangle', points: [[400, 350], [350, 280], [450, 280]], fill: false },
                { type: 'triangle', points: [[360, 280], [350, 250], [380, 260]], fill: false },
                { type: 'triangle', points: [[440, 280], [450, 250], [420, 260]], fill: false },
                { type: 'circle', x: 380, y: 300, r: 5, fill: true },
                { type: 'circle', x: 420, y: 300, r: 5, fill: true },
                { type: 'bezier', points: [[430, 350], [480, 360], [490, 380], [470, 400]], fill: false }
            ]
        },
        // 27. 狼
        {
            id: 'wolf',
            name: '狼',
            icon: '🐺',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 60, ry: 50, fill: false },
                { type: 'triangle', points: [[365, 270], [355, 240], [380, 255]], fill: false },
                { type: 'triangle', points: [[435, 270], [445, 240], [420, 255]], fill: false },
                { type: 'circle', x: 380, y: 290, r: 6, fill: true },
                { type: 'circle', x: 420, y: 290, r: 6, fill: true },
                { type: 'line', x1: 380, y1: 320, x2: 380, y2: 325 },
                { type: 'line', x1: 390, y1: 320, x2: 390, y2: 325 },
                { type: 'line', x1: 410, y1: 320, x2: 410, y2: 325 },
                { type: 'line', x1: 420, y1: 320, x2: 420, y2: 325 }
            ]
        },
        // 28. 鹿
        {
            id: 'deer',
            name: '鹿',
            icon: '🦌',
            paths: [
                { type: 'ellipse', x: 400, y: 350, rx: 60, ry: 70, fill: false },
                { type: 'ellipse', x: 400, y: 280, rx: 35, ry: 30, fill: false },
                { type: 'line', x1: 380, y1: 250, x2: 375, y2: 230 },
                { type: 'line', x1: 375, y1: 230, x2: 370, y2: 235 },
                { type: 'line', x1: 375, y1: 230, x2: 380, y2: 225 },
                { type: 'line', x1: 420, y1: 250, x2: 425, y2: 230 },
                { type: 'line', x1: 425, y1: 230, x2: 420, y2: 225 },
                { type: 'line', x1: 425, y1: 230, x2: 430, y2: 235 }
            ]
        },
        // 29. 松鼠
        {
            id: 'squirrel',
            name: '松鼠',
            icon: '🐿️',
            paths: [
                { type: 'ellipse', x: 400, y: 320, rx: 40, ry: 50, fill: false },
                { type: 'circle', x: 400, y: 270, r: 30, fill: false },
                { type: 'triangle', points: [[380, 250], [375, 235], [390, 240]], fill: false },
                { type: 'triangle', points: [[420, 250], [425, 235], [410, 240]], fill: false },
                { type: 'bezier', points: [[440, 330], [480, 320], [490, 280], [470, 240]], fill: false }
            ]
        },
        // 30. 刺猬
        {
            id: 'hedgehog',
            name: '刺猬',
            icon: '🦔',
            paths: [
                { type: 'ellipse', x: 400, y: 320, rx: 60, ry: 40, fill: false },
                { type: 'triangle', points: [[440, 315], [455, 320], [450, 305]], fill: true },
                { type: 'circle', x: 430, y: 315, r: 4, fill: true },
                { type: 'line', x1: 360, y1: 300, x2: 350, y2: 285 },
                { type: 'line', x1: 370, y1: 295, x2: 360, y2: 280 },
                { type: 'line', x1: 380, y1: 290, x2: 375, y2: 275 },
                { type: 'line', x1: 390, y1: 285, x2: 385, y2: 270 },
                { type: 'line', x1: 400, y1: 285, x2: 400, y2: 270 },
                { type: 'line', x1: 410, y1: 285, x2: 415, y2: 270 },
                { type: 'line', x1: 420, y1: 290, x2: 425, y2: 275 }
            ]
        }
    ],
    
    plants: [
        // 31. 花朵
        {
            id: 'flower',
            name: '花朵',
            icon: '🌸',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 25, fill: false },
                { type: 'ellipse', x: 400, y: 250, rx: 20, ry: 30, fill: false },
                { type: 'ellipse', x: 450, y: 300, rx: 30, ry: 20, fill: false },
                { type: 'ellipse', x: 400, y: 350, rx: 20, ry: 30, fill: false },
                { type: 'ellipse', x: 350, y: 300, rx: 30, ry: 20, fill: false },
                { type: 'line', x1: 400, y1: 350, x2: 400, y2: 450 }
            ]
        },
        // 32. 大树
        {
            id: 'tree',
            name: '大树',
            icon: '🌳',
            paths: [
                { type: 'rect', x: 385, y: 380, width: 30, height: 80, fill: false },
                { type: 'circle', x: 400, y: 320, r: 50, fill: false },
                { type: 'circle', x: 370, y: 290, r: 40, fill: false },
                { type: 'circle', x: 430, y: 290, r: 40, fill: false },
                { type: 'circle', x: 400, y: 270, r: 35, fill: false }
            ]
        },
        // 33. 太阳
        {
            id: 'sun',
            name: '太阳',
            icon: '☀️',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 40, fill: false },
                { type: 'line', x1: 400, y1: 240, x2: 400, y2: 200 },
                { type: 'line', x1: 400, y1: 360, x2: 400, y2: 400 },
                { type: 'line', x1: 340, y1: 300, x2: 300, y2: 300 },
                { type: 'line', x1: 460, y1: 300, x2: 500, y2: 300 },
                { type: 'line', x1: 355, y1: 255, x2: 325, y2: 225 },
                { type: 'line', x1: 445, y1: 345, x2: 475, y2: 375 },
                { type: 'line', x1: 355, y1: 345, x2: 325, y2: 375 },
                { type: 'line', x1: 445, y1: 255, x2: 475, y2: 225 }
            ]
        },
        // 34. 彩虹
        {
            id: 'rainbow',
            name: '彩虹',
            icon: '🌈',
            paths: [
                { type: 'arc', x: 400, y: 400, r: 150, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 400, y: 400, r: 140, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 400, y: 400, r: 130, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 400, y: 400, r: 120, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 400, y: 400, r: 110, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 400, y: 400, r: 100, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 400, y: 400, r: 90, start: Math.PI, end: 0, fill: false }
            ]
        },
        // 35. 玫瑰
        {
            id: 'rose',
            name: '玫瑰',
            icon: '🌹',
            paths: [
                { type: 'arc', x: 400, y: 280, r: 20, start: 0, end: Math.PI, fill: false },
                { type: 'arc', x: 390, y: 290, r: 20, start: Math.PI/2, end: Math.PI*1.5, fill: false },
                { type: 'arc', x: 410, y: 290, r: 20, start: Math.PI*1.5, end: Math.PI/2, fill: false },
                { type: 'arc', x: 400, y: 300, r: 25, start: 0, end: Math.PI*2, fill: false },
                { type: 'line', x1: 400, y1: 325, x2: 400, y2: 420 },
                { type: 'ellipse', x: 380, y: 360, rx: 15, ry: 8, fill: false },
                { type: 'ellipse', x: 420, y: 380, rx: 15, ry: 8, fill: false }
            ]
        },
        // 36. 郁金香
        {
            id: 'tulip',
            name: '郁金香',
            icon: '🌷',
            paths: [
                { type: 'arc', x: 400, y: 300, r: 30, start: Math.PI, end: 0, fill: false },
                { type: 'line', x1: 370, y1: 300, x2: 370, y2: 270 },
                { type: 'line', x1: 400, y1: 300, x2: 400, y2: 265 },
                { type: 'line', x1: 430, y1: 300, x2: 430, y2: 270 },
                { type: 'line', x1: 400, y1: 300, x2: 400, y2: 420 },
                { type: 'ellipse', x: 380, y: 360, rx: 20, ry: 10, fill: false }
            ]
        },
        // 37. 向日葵
        {
            id: 'sunflower',
            name: '向日葵',
            icon: '🌻',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 30, fill: true },
                { type: 'ellipse', x: 400, y: 230, rx: 15, ry: 25, fill: false },
                { type: 'ellipse', x: 450, y: 280, rx: 25, ry: 15, fill: false },
                { type: 'ellipse', x: 400, y: 330, rx: 15, ry: 25, fill: false },
                { type: 'ellipse', x: 350, y: 280, rx: 25, ry: 15, fill: false },
                { type: 'ellipse', x: 430, y: 250, rx: 20, ry: 20, fill: false },
                { type: 'ellipse', x: 370, y: 250, rx: 20, ry: 20, fill: false },
                { type: 'ellipse', x: 430, y: 310, rx: 20, ry: 20, fill: false },
                { type: 'ellipse', x: 370, y: 310, rx: 20, ry: 20, fill: false },
                { type: 'line', x1: 400, y1: 310, x2: 400, y2: 450 }
            ]
        },
        // 38. 仙人掌
        {
            id: 'cactus',
            name: '仙人掌',
            icon: '🌵',
            paths: [
                { type: 'ellipse', x: 400, y: 350, rx: 40, ry: 100, fill: false },
                { type: 'ellipse', x: 350, y: 320, rx: 25, ry: 40, fill: false },
                { type: 'ellipse', x: 450, y: 360, rx: 25, ry: 40, fill: false },
                { type: 'circle', x: 390, y: 280, r: 3, fill: true },
                { type: 'circle', x: 410, y: 280, r: 3, fill: true }
            ]
        },
        // 39. 蘑菇
        {
            id: 'mushroom',
            name: '蘑菇',
            icon: '🍄',
            paths: [
                { type: 'arc', x: 400, y: 300, r: 60, start: Math.PI, end: 0, fill: false },
                { type: 'rect', x: 380, y: 300, width: 40, height: 60, fill: false },
                { type: 'circle', x: 380, y: 280, r: 10, fill: true },
                { type: 'circle', x: 420, y: 280, r: 10, fill: true },
                { type: 'circle', x: 400, y: 260, r: 8, fill: true }
            ]
        },
        // 40. 竹子
        {
            id: 'bamboo',
            name: '竹子',
            icon: '🎋',
            paths: [
                { type: 'rect', x: 380, y: 250, width: 15, height: 200, fill: false },
                { type: 'rect', x: 405, y: 270, width: 15, height: 180, fill: false },
                { type: 'line', x1: 380, y1: 300, x2: 395, y2: 300 },
                { type: 'line', x1: 380, y1: 350, x2: 395, y2: 350 },
                { type: 'line', x1: 380, y1: 400, x2: 395, y2: 400 },
                { type: 'line', x1: 405, y1: 320, x2: 420, y2: 320 },
                { type: 'line', x1: 405, y1: 370, x2: 420, y2: 370 },
                { type: 'ellipse', x: 370, y: 280, rx: 20, ry: 10, fill: false },
                { type: 'ellipse', x: 430, y: 300, rx: 20, ry: 10, fill: false }
            ]
        },
        // 41. 椰子树
        {
            id: 'palm',
            name: '椰子树',
            icon: '🌴',
            paths: [
                { type: 'arc', x: 400, y: 400, r: 30, start: Math.PI*0.3, end: Math.PI*0.7, fill: false },
                { type: 'bezier', points: [[400, 280], [350, 250], [300, 240], [280, 260]], fill: false },
                { type: 'bezier', points: [[400, 280], [450, 250], [500, 240], [520, 260]], fill: false },
                { type: 'bezier', points: [[400, 280], [380, 240], [360, 210], [370, 190]], fill: false },
                { type: 'bezier', points: [[400, 280], [420, 240], [440, 210], [430, 190]], fill: false },
                { type: 'circle', x: 380, y: 380, r: 10, fill: false },
                { type: 'circle', x: 420, y: 380, r: 10, fill: false }
            ]
        },
        // 42. 叶子
        {
            id: 'leaf',
            name: '叶子',
            icon: '🍃',
            paths: [
                { type: 'bezier', points: [[350, 350], [350, 280], [400, 250], [450, 280]], fill: false },
                { type: 'bezier', points: [[450, 280], [450, 350], [400, 380], [350, 350]], fill: false },
                { type: 'line', x1: 400, y1: 250, x2: 400, y2: 380 },
                { type: 'line', x1: 400, y1: 280, x2: 380, y2: 290 },
                { type: 'line', x1: 400, y1: 310, x2: 420, y2: 320 },
                { type: 'line', x1: 400, y1: 340, x2: 380, y2: 350 }
            ]
        },
        // 43. 松树
        {
            id: 'pine',
            name: '松树',
            icon: '🌲',
            paths: [
                { type: 'triangle', points: [[400, 250], [350, 320], [450, 320]], fill: false },
                { type: 'triangle', points: [[400, 290], [340, 360], [460, 360]], fill: false },
                { type: 'triangle', points: [[400, 330], [330, 400], [470, 400]], fill: false },
                { type: 'rect', x: 390, y: 400, width: 20, height: 50, fill: false }
            ]
        },
        // 44. 三叶草
        {
            id: 'clover',
            name: '三叶草',
            icon: '🍀',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 20, fill: false },
                { type: 'circle', x: 380, y: 300, r: 20, fill: false },
                { type: 'circle', x: 420, y: 300, r: 20, fill: false },
                { type: 'line', x1: 400, y1: 320, x2: 400, y2: 400 }
            ]
        },
        // 45. 草
        {
            id: 'grass',
            name: '草',
            icon: '🌿',
            paths: [
                { type: 'line', x1: 380, y1: 400, x2: 380, y2: 350 },
                { type: 'line', x1: 390, y1: 400, x2: 390, y2: 340 },
                { type: 'line', x1: 400, y1: 400, x2: 400, y2: 330 },
                { type: 'line', x1: 410, y1: 400, x2: 410, y2: 340 },
                { type: 'line', x1: 420, y1: 400, x2: 420, y2: 350 },
                { type: 'bezier', points: [[380, 350], [375, 340], [370, 330], [365, 320]], fill: false },
                { type: 'bezier', points: [[420, 350], [425, 340], [430, 330], [435, 320]], fill: false }
            ]
        }
    ],
    
    objects: [
        // 46. 房子
        {
            id: 'house',
            name: '房子',
            icon: '🏠',
            paths: [
                { type: 'rect', x: 340, y: 320, width: 120, height: 100, fill: false },
                { type: 'triangle', points: [[400, 260], [320, 320], [480, 320]], fill: false },
                { type: 'rect', x: 360, y: 340, width: 30, height: 30, fill: false },
                { type: 'rect', x: 410, y: 340, width: 30, height: 30, fill: false },
                { type: 'rect', x: 380, y: 380, width: 40, height: 40, fill: false }
            ]
        },
        // 47. 汽车
        {
            id: 'car',
            name: '汽车',
            icon: '🚗',
            paths: [
                { type: 'rect', x: 330, y: 320, width: 140, height: 40, fill: false },
                { type: 'rect', x: 350, y: 290, width: 100, height: 30, fill: false },
                { type: 'circle', x: 360, y: 370, r: 15, fill: false },
                { type: 'circle', x: 440, y: 370, r: 15, fill: false },
                { type: 'rect', x: 365, y: 300, width: 30, height: 20, fill: false },
                { type: 'rect', x: 405, y: 300, width: 30, height: 20, fill: false }
            ]
        },
        // 48. 球
        {
            id: 'ball',
            name: '球',
            icon: '⚽',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 60, fill: false },
                { type: 'line', x1: 400, y1: 240, x2: 400, y2: 360 },
                { type: 'arc', x: 400, y: 300, r: 60, start: Math.PI*0.3, end: Math.PI*0.7, fill: false },
                { type: 'arc', x: 400, y: 300, r: 60, start: Math.PI*1.3, end: Math.PI*1.7, fill: false }
            ]
        },
        // 49. 星星
        {
            id: 'star',
            name: '星星',
            icon: '⭐',
            paths: [
                { type: 'polygon', points: [
                    [400, 250], [415, 290], [455, 290], [425, 315], 
                    [440, 355], [400, 330], [360, 355], [375, 315], 
                    [345, 290], [385, 290]
                ], fill: false }
            ]
        },
        // 50. 爱心
        {
            id: 'heart',
            name: '爱心',
            icon: '❤️',
            paths: [
                { type: 'arc', x: 375, y: 280, r: 25, start: Math.PI, end: 0, fill: false },
                { type: 'arc', x: 425, y: 280, r: 25, start: Math.PI, end: 0, fill: false },
                { type: 'line', x1: 350, y1: 280, x2: 400, y2: 350 },
                { type: 'line', x1: 450, y1: 280, x2: 400, y2: 350 }
            ]
        },
        // 51. 月亮
        {
            id: 'moon',
            name: '月亮',
            icon: '🌙',
            paths: [
                { type: 'arc', x: 400, y: 300, r: 60, start: Math.PI*0.3, end: Math.PI*1.7, fill: false },
                { type: 'arc', x: 420, y: 300, r: 50, start: Math.PI*0.4, end: Math.PI*1.6, fill: false }
            ]
        },
        // 52. 云朵
        {
            id: 'cloud',
            name: '云朵',
            icon: '☁️',
            paths: [
                { type: 'circle', x: 360, y: 300, r: 30, fill: false },
                { type: 'circle', x: 400, y: 290, r: 35, fill: false },
                { type: 'circle', x: 440, y: 300, r: 30, fill: false },
                { type: 'ellipse', x: 400, y: 320, rx: 60, ry: 20, fill: false }
            ]
        },
        // 53. 雨伞
        {
            id: 'umbrella',
            name: '雨伞',
            icon: '☂️',
            paths: [
                { type: 'arc', x: 400, y: 300, r: 80, start: Math.PI, end: 0, fill: false },
                { type: 'line', x1: 320, y1: 300, x2: 480, y2: 300 },
                { type: 'line', x1: 400, y1: 300, x2: 400, y2: 400 },
                { type: 'arc', x: 410, y: 400, r: 10, start: 0, end: Math.PI, fill: false }
            ]
        },
        // 54. 书本
        {
            id: 'book',
            name: '书本',
            icon: '📚',
            paths: [
                { type: 'rect', x: 340, y: 280, width: 60, height: 80, fill: false },
                { type: 'rect', x: 400, y: 280, width: 60, height: 80, fill: false },
                { type: 'line', x1: 400, y1: 280, x2: 400, y2: 360 },
                { type: 'line', x1: 350, y1: 300, x2: 390, y2: 300 },
                { type: 'line', x1: 350, y1: 320, x2: 390, y2: 320 },
                { type: 'line', x1: 350, y1: 340, x2: 390, y2: 340 }
            ]
        },
        // 55. 礼物
        {
            id: 'gift',
            name: '礼物',
            icon: '🎁',
            paths: [
                { type: 'rect', x: 350, y: 320, width: 100, height: 80, fill: false },
                { type: 'rect', x: 340, y: 300, width: 120, height: 20, fill: false },
                { type: 'line', x1: 400, y1: 300, x2: 400, y2: 400 },
                { type: 'arc', x: 385, y: 290, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'arc', x: 415, y: 290, r: 15, start: 0, end: Math.PI, fill: false }
            ]
        },
        // 56. 气球
        {
            id: 'balloon',
            name: '气球',
            icon: '🎈',
            paths: [
                { type: 'ellipse', x: 400, y: 280, rx: 35, ry: 45, fill: false },
                { type: 'triangle', points: [[400, 325], [395, 335], [405, 335]], fill: false },
                { type: 'line', x1: 400, y1: 335, x2: 400, y2: 400 }
            ]
        },
        // 57. 风筝
        {
            id: 'kite',
            name: '风筝',
            icon: '🪁',
            paths: [
                { type: 'polygon', points: [[400, 250], [350, 300], [400, 350], [450, 300]], fill: false },
                { type: 'line', x1: 400, y1: 250, x2: 400, y2: 350 },
                { type: 'line', x1: 350, y1: 300, x2: 450, y2: 300 },
                { type: 'line', x1: 400, y1: 350, x2: 380, y2: 420 },
                { type: 'arc', x: 380, y: 380, r: 10, start: 0, end: Math.PI/2, fill: false },
                { type: 'arc', x: 380, y: 400, r: 10, start: 0, end: Math.PI/2, fill: false }
            ]
        },
        // 58. 船
        {
            id: 'boat',
            name: '小船',
            icon: '⛵',
            paths: [
                { type: 'arc', x: 400, y: 350, r: 80, start: 0, end: Math.PI, fill: false },
                { type: 'line', x1: 400, y1: 350, x2: 400, y2: 280 },
                { type: 'triangle', points: [[400, 280], [430, 315], [400, 350]], fill: false }
            ]
        },
        // 59. 飞机
        {
            id: 'airplane',
            name: '飞机',
            icon: '✈️',
            paths: [
                { type: 'ellipse', x: 400, y: 300, rx: 80, ry: 20, fill: false },
                { type: 'ellipse', x: 380, y: 280, rx: 40, ry: 10, fill: false },
                { type: 'ellipse', x: 380, y: 320, rx: 40, ry: 10, fill: false },
                { type: 'triangle', points: [[470, 300], [490, 280], [490, 320]], fill: false },
                { type: 'circle', x: 350, y: 300, r: 15, fill: false }
            ]
        },
        // 60. 火箭
        {
            id: 'rocket',
            name: '火箭',
            icon: '🚀',
            paths: [
                { type: 'triangle', points: [[400, 240], [380, 280], [420, 280]], fill: false },
                { type: 'rect', x: 380, y: 280, width: 40, height: 100, fill: false },
                { type: 'triangle', points: [[380, 380], [360, 400], [380, 360]], fill: false },
                { type: 'triangle', points: [[420, 380], [440, 400], [420, 360]], fill: false },
                { type: 'circle', x: 400, y: 310, r: 10, fill: false }
            ]
        }
    ],
    
    nature: [
        // 61. 山
        {
            id: 'mountain',
            name: '山',
            icon: '⛰️',
            paths: [
                { type: 'triangle', points: [[400, 250], [320, 400], [480, 400]], fill: false },
                { type: 'triangle', points: [[450, 300], [380, 400], [520, 400]], fill: false },
                { type: 'line', x1: 400, y1: 250, x2: 380, y2: 280 },
                { type: 'line', x1: 380, y1: 280, x2: 420, y2: 280 }
            ]
        },
        // 62. 波浪
        {
            id: 'wave',
            name: '波浪',
            icon: '🌊',
            paths: [
                { type: 'bezier', points: [[300, 300], [350, 280], [400, 300], [450, 280]], fill: false },
                { type: 'bezier', points: [[450, 280], [500, 300], [550, 280], [600, 300]], fill: false },
                { type: 'bezier', points: [[300, 320], [350, 300], [400, 320], [450, 300]], fill: false },
                { type: 'bezier', points: [[450, 300], [500, 320], [550, 300], [600, 320]], fill: false }
            ]
        },
        // 63. 火焰
        {
            id: 'fire',
            name: '火焰',
            icon: '🔥',
            paths: [
                { type: 'bezier', points: [[400, 380], [380, 340], [380, 300], [400, 260]], fill: false },
                { type: 'bezier', points: [[400, 260], [420, 300], [420, 340], [400, 380]], fill: false },
                { type: 'bezier', points: [[390, 360], [380, 340], [380, 320], [390, 300]], fill: false },
                { type: 'bezier', points: [[410, 360], [420, 340], [420, 320], [410, 300]], fill: false }
            ]
        },
        // 64. 雪花
        {
            id: 'snowflake',
            name: '雪花',
            icon: '❄️',
            paths: [
                { type: 'line', x1: 400, y1: 250, x2: 400, y2: 350 },
                { type: 'line', x1: 350, y1: 300, x2: 450, y2: 300 },
                { type: 'line', x1: 365, y1: 265, x2: 435, y2: 335 },
                { type: 'line', x1: 435, y1: 265, x2: 365, y2: 335 },
                { type: 'circle', x: 400, y: 250, r: 5, fill: false },
                { type: 'circle', x: 400, y: 350, r: 5, fill: false },
                { type: 'circle', x: 350, y: 300, r: 5, fill: false },
                { type: 'circle', x: 450, y: 300, r: 5, fill: false }
            ]
        },
        // 65. 雨滴
        {
            id: 'raindrop',
            name: '雨滴',
            icon: '💧',
            paths: [
                { type: 'arc', x: 400, y: 320, r: 30, start: 0, end: Math.PI, fill: false },
                { type: 'bezier', points: [[370, 320], [380, 280], [400, 260], [400, 260]], fill: false },
                { type: 'bezier', points: [[430, 320], [420, 280], [400, 260], [400, 260]], fill: false }
            ]
        },
        // 66. 闪电
        {
            id: 'lightning',
            name: '闪电',
            icon: '⚡',
            paths: [
                { type: 'polygon', points: [
                    [420, 250], [380, 310], [400, 310], [380, 380], 
                    [420, 320], [400, 320]
                ], fill: false }
            ]
        },
        // 67. 龙卷风
        {
            id: 'tornado',
            name: '龙卷风',
            icon: '🌪️',
            paths: [
                { type: 'arc', x: 400, y: 280, r: 50, start: 0, end: Math.PI*1.5, fill: false },
                { type: 'arc', x: 400, y: 320, r: 40, start: Math.PI*0.5, end: Math.PI*2, fill: false },
                { type: 'arc', x: 400, y: 360, r: 30, start: 0, end: Math.PI*1.5, fill: false },
                { type: 'arc', x: 400, y: 390, r: 20, start: Math.PI*0.5, end: Math.PI*2, fill: false },
                { type: 'arc', x: 400, y: 410, r: 10, start: 0, end: Math.PI*1.5, fill: false }
            ]
        },
        // 68. 火山
        {
            id: 'volcano',
            name: '火山',
            icon: '🌋',
            paths: [
                { type: 'triangle', points: [[400, 300], [340, 400], [460, 400]], fill: false },
                { type: 'ellipse', x: 400, y: 300, rx: 30, ry: 15, fill: false },
                { type: 'ellipse', x: 395, y: 280, rx: 8, ry: 15, fill: false },
                { type: 'ellipse', x: 405, y: 280, rx: 8, ry: 15, fill: false },
                { type: 'circle', x: 390, y: 260, r: 5, fill: true },
                { type: 'circle', x: 410, y: 265, r: 5, fill: true }
            ]
        },
        // 69. 岛屿
        {
            id: 'island',
            name: '岛屿',
            icon: '🏝️',
            paths: [
                { type: 'ellipse', x: 400, y: 350, rx: 100, ry: 30, fill: false },
                { type: 'ellipse', x: 420, y: 320, rx: 15, ry: 40, fill: false },
                { type: 'bezier', points: [[420, 280], [400, 260], [380, 250], [360, 260]], fill: false },
                { type: 'bezier', points: [[420, 280], [440, 260], [460, 250], [480, 260]], fill: false },
                { type: 'circle', x: 440, y: 330, r: 8, fill: false },
                { type: 'circle', x: 450, y: 335, r: 8, fill: false }
            ]
        },
        // 70. 沙漠
        {
            id: 'desert',
            name: '沙漠',
            icon: '🏜️',
            paths: [
                { type: 'bezier', points: [[300, 350], [350, 330], [400, 350], [450, 330]], fill: false },
                { type: 'bezier', points: [[450, 330], [500, 350], [550, 330], [600, 350]], fill: false },
                { type: 'ellipse', x: 420, y: 300, rx: 15, ry: 40, fill: false },
                { type: 'bezier', points: [[420, 260], [405, 250], [390, 260], [380, 270]], fill: false },
                { type: 'bezier', points: [[420, 260], [435, 250], [450, 260], [460, 270]], fill: false }
            ]
        }
    ],
    
    food: [
        // 71. 苹果
        {
            id: 'apple',
            name: '苹果',
            icon: '🍎',
            paths: [
                { type: 'arc', x: 380, y: 320, r: 40, start: Math.PI*0.8, end: Math.PI*2.2, fill: false },
                { type: 'arc', x: 420, y: 320, r: 40, start: Math.PI*1.8, end: Math.PI*1.2, fill: false },
                { type: 'line', x1: 400, y1: 280, x2: 400, y2: 260 },
                { type: 'ellipse', x: 410, y: 260, rx: 10, ry: 5, fill: false }
            ]
        },
        // 72. 香蕉
        {
            id: 'banana',
            name: '香蕉',
            icon: '🍌',
            paths: [
                { type: 'bezier', points: [[360, 280], [340, 320], [360, 360], [400, 380]], fill: false },
                { type: 'bezier', points: [[360, 280], [380, 320], [380, 360], [400, 380]], fill: false },
                { type: 'arc', x: 360, y: 280, r: 10, start: Math.PI, end: 0, fill: false }
            ]
        },
        // 73. 西瓜
        {
            id: 'watermelon',
            name: '西瓜',
            icon: '🍉',
            paths: [
                { type: 'arc', x: 400, y: 320, r: 60, start: Math.PI, end: 0, fill: false },
                { type: 'line', x1: 340, y1: 320, x2: 460, y2: 320 },
                { type: 'circle', x: 380, y: 300, r: 3, fill: true },
                { type: 'circle', x: 400, y: 295, r: 3, fill: true },
                { type: 'circle', x: 420, y: 300, r: 3, fill: true },
                { type: 'circle', x: 390, y: 280, r: 3, fill: true },
                { type: 'circle', x: 410, y: 280, r: 3, fill: true }
            ]
        },
        // 74. 葡萄
        {
            id: 'grape',
            name: '葡萄',
            icon: '🍇',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 12, fill: false },
                { type: 'circle', x: 385, y: 295, r: 12, fill: false },
                { type: 'circle', x: 415, y: 295, r: 12, fill: false },
                { type: 'circle', x: 400, y: 310, r: 12, fill: false },
                { type: 'circle', x: 385, y: 325, r: 12, fill: false },
                { type: 'circle', x: 415, y: 325, r: 12, fill: false },
                { type: 'circle', x: 400, y: 340, r: 12, fill: false }
            ]
        },
        // 75. 草莓
        {
            id: 'strawberry',
            name: '草莓',
            icon: '🍓',
            paths: [
                { type: 'bezier', points: [[400, 280], [360, 300], [360, 340], [400, 360]], fill: false },
                { type: 'bezier', points: [[400, 280], [440, 300], [440, 340], [400, 360]], fill: false },
                { type: 'ellipse', x: 400, y: 275, rx: 15, ry: 8, fill: false },
                { type: 'circle', x: 380, y: 310, r: 2, fill: true },
                { type: 'circle', x: 420, y: 310, r: 2, fill: true },
                { type: 'circle', x: 390, y: 330, r: 2, fill: true },
                { type: 'circle', x: 410, y: 330, r: 2, fill: true },
                { type: 'circle', x: 400, y: 320, r: 2, fill: true }
            ]
        },
        // 76. 胡萝卜
        {
            id: 'carrot',
            name: '胡萝卜',
            icon: '🥕',
            paths: [
                { type: 'triangle', points: [[400, 380], [385, 280], [415, 280]], fill: false },
                { type: 'ellipse', x: 400, y: 275, rx: 20, ry: 10, fill: false },
                { type: 'line', x1: 390, y1: 300, x2: 410, y2: 300 },
                { type: 'line', x1: 392, y1: 320, x2: 408, y2: 320 },
                { type: 'line', x1: 394, y1: 340, x2: 406, y2: 340 },
                { type: 'line', x1: 396, y1: 360, x2: 404, y2: 360 }
            ]
        },
        // 77. 蛋糕
        {
            id: 'cake',
            name: '蛋糕',
            icon: '🎂',
            paths: [
                { type: 'rect', x: 360, y: 340, width: 80, height: 40, fill: false },
                { type: 'rect', x: 355, y: 320, width: 90, height: 20, fill: false },
                { type: 'rect', x: 350, y: 300, width: 100, height: 20, fill: false },
                { type: 'line', x1: 380, y1: 300, x2: 380, y2: 285 },
                { type: 'line', x1: 400, y1: 300, x2: 400, y2: 285 },
                { type: 'line', x1: 420, y1: 300, x2: 420, y2: 285 },
                { type: 'circle', x: 380, y: 280, r: 5, fill: false },
                { type: 'circle', x: 400, y: 280, r: 5, fill: false },
                { type: 'circle', x: 420, y: 280, r: 5, fill: false }
            ]
        },
        // 78. 冰淇淋
        {
            id: 'icecream',
            name: '冰淇淋',
            icon: '🍦',
            paths: [
                { type: 'triangle', points: [[400, 380], [380, 320], [420, 320]], fill: false },
                { type: 'circle', x: 385, y: 300, r: 20, fill: false },
                { type: 'circle', x: 415, y: 300, r: 20, fill: false },
                { type: 'circle', x: 400, y: 285, r: 18, fill: false }
            ]
        },
        // 79. 披萨
        {
            id: 'pizza',
            name: '披萨',
            icon: '🍕',
            paths: [
                { type: 'triangle', points: [[400, 280], [350, 380], [450, 380]], fill: false },
                { type: 'arc', x: 400, y: 380, r: 70, start: Math.PI*1.25, end: Math.PI*1.75, fill: false },
                { type: 'circle', x: 390, y: 320, r: 8, fill: false },
                { type: 'circle', x: 410, y: 340, r: 8, fill: false },
                { type: 'circle', x: 380, y: 355, r: 8, fill: false },
                { type: 'circle', x: 420, y: 355, r: 8, fill: false }
            ]
        },
        // 80. 汉堡
        {
            id: 'burger',
            name: '汉堡',
            icon: '🍔',
            paths: [
                { type: 'arc', x: 400, y: 290, r: 50, start: Math.PI, end: 0, fill: false },
                { type: 'line', x1: 350, y1: 300, x2: 450, y2: 300 },
                { type: 'rect', x: 355, y: 300, width: 90, height: 15, fill: false },
                { type: 'ellipse', x: 400, y: 322, rx: 45, ry: 8, fill: false },
                { type: 'arc', x: 400, y: 340, r: 50, start: 0, end: Math.PI, fill: false }
            ]
        }
    ],
    
    vehicles: [
        // 81. 火车
        {
            id: 'train',
            name: '火车',
            icon: '🚂',
            paths: [
                { type: 'rect', x: 320, y: 330, width: 50, height: 40, fill: false },
                { type: 'rect', x: 370, y: 340, width: 60, height: 30, fill: false },
                { type: 'rect', x: 430, y: 340, width: 60, height: 30, fill: false },
                { type: 'circle', x: 340, y: 380, r: 8, fill: false },
                { type: 'circle', x: 355, y: 380, r: 8, fill: false },
                { type: 'circle', x: 390, y: 380, r: 8, fill: false },
                { type: 'circle', x: 410, y: 380, r: 8, fill: false },
                { type: 'circle', x: 450, y: 380, r: 8, fill: false },
                { type: 'circle', x: 470, y: 380, r: 8, fill: false },
                { type: 'rect', x: 325, y: 320, width: 15, height: 10, fill: false }
            ]
        },
        // 82. 自行车
        {
            id: 'bicycle',
            name: '自行车',
            icon: '🚲',
            paths: [
                { type: 'circle', x: 350, y: 350, r: 30, fill: false },
                { type: 'circle', x: 450, y: 350, r: 30, fill: false },
                { type: 'line', x1: 350, y1: 350, x2: 400, y2: 320 },
                { type: 'line', x1: 400, y1: 320, x2: 450, y2: 350 },
                { type: 'line', x1: 400, y1: 320, x2: 400, y2: 300 },
                { type: 'line', x1: 380, y1: 300, x2: 420, y2: 300 },
                { type: 'line', x1: 390, y1: 320, x2: 380, y2: 340 }
            ]
        },
        // 83. 轮船
        {
            id: 'ship',
            name: '轮船',
            icon: '🚢',
            paths: [
                { type: 'arc', x: 400, y: 360, r: 80, start: 0, end: Math.PI, fill: false },
                { type: 'rect', x: 370, y: 340, width: 60, height: 20, fill: false },
                { type: 'rect', x: 380, y: 320, width: 40, height: 20, fill: false },
                { type: 'rect', x: 390, y: 310, width: 10, height: 10, fill: false },
                { type: 'line', x1: 410, y1: 310, x2: 410, y2: 290 },
                { type: 'triangle', points: [[410, 290], [410, 305], [425, 297]], fill: false }
            ]
        },
        // 84. 直升机
        {
            id: 'helicopter',
            name: '直升机',
            icon: '🚁',
            paths: [
                { type: 'ellipse', x: 400, y: 320, rx: 50, ry: 30, fill: false },
                { type: 'line', x1: 400, y1: 290, x2: 400, y2: 280 },
                { type: 'line', x1: 350, y1: 280, x2: 450, y2: 280 },
                { type: 'ellipse', x: 470, y: 320, rx: 15, ry: 5, fill: false },
                { type: 'line', x1: 485, y1: 320, x2: 485, y2: 300 },
                { type: 'line', x1: 475, y1: 300, x2: 495, y2: 300 },
                { type: 'line', x1: 380, y1: 350, x2: 380, y2: 360 },
                { type: 'line', x1: 420, y1: 350, x2: 420, y2: 360 }
            ]
        },
        // 85. 公交车
        {
            id: 'bus',
            name: '公交车',
            icon: '🚌',
            paths: [
                { type: 'rect', x: 340, y: 300, width: 120, height: 60, fill: false },
                { type: 'rect', x: 350, y: 310, width: 25, height: 25, fill: false },
                { type: 'rect', x: 380, y: 310, width: 25, height: 25, fill: false },
                { type: 'rect', x: 410, y: 310, width: 25, height: 25, fill: false },
                { type: 'circle', x: 365, y: 370, r: 10, fill: false },
                { type: 'circle', x: 435, y: 370, r: 10, fill: false }
            ]
        }
    ],
    
    people: [
        // 86. 笑脸
        {
            id: 'smiley',
            name: '笑脸',
            icon: '😊',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 60, fill: false },
                { type: 'circle', x: 380, y: 285, r: 8, fill: true },
                { type: 'circle', x: 420, y: 285, r: 8, fill: true },
                { type: 'arc', x: 400, y: 310, r: 30, start: 0, end: Math.PI, fill: false }
            ]
        },
        // 87. 男孩
        {
            id: 'boy',
            name: '男孩',
            icon: '👦',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 40, fill: false },
                { type: 'arc', x: 400, y: 260, r: 40, start: Math.PI, end: 0, fill: false },
                { type: 'circle', x: 385, y: 275, r: 5, fill: true },
                { type: 'circle', x: 415, y: 275, r: 5, fill: true },
                { type: 'arc', x: 400, y: 290, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'rect', x: 370, y: 320, width: 60, height: 80, fill: false },
                { type: 'line', x1: 370, y1: 340, x2: 350, y2: 380 },
                { type: 'line', x1: 430, y1: 340, x2: 450, y2: 380 }
            ]
        },
        // 88. 女孩
        {
            id: 'girl',
            name: '女孩',
            icon: '👧',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 40, fill: false },
                { type: 'bezier', points: [[360, 260], [360, 240], [380, 250], [400, 260]], fill: false },
                { type: 'bezier', points: [[440, 260], [440, 240], [420, 250], [400, 260]], fill: false },
                { type: 'circle', x: 385, y: 275, r: 5, fill: true },
                { type: 'circle', x: 415, y: 275, r: 5, fill: true },
                { type: 'arc', x: 400, y: 290, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'triangle', points: [[400, 320], [370, 400], [430, 400]], fill: false }
            ]
        },
        // 89. 手
        {
            id: 'hand',
            name: '手',
            icon: '✋',
            paths: [
                { type: 'ellipse', x: 400, y: 340, rx: 40, ry: 60, fill: false },
                { type: 'ellipse', x: 370, y: 300, rx: 8, ry: 25, fill: false },
                { type: 'ellipse', x: 385, y: 290, rx: 8, ry: 30, fill: false },
                { type: 'ellipse', x: 400, y: 285, rx: 8, ry: 32, fill: false },
                { type: 'ellipse', x: 415, y: 290, rx: 8, ry: 30, fill: false },
                { type: 'ellipse', x: 430, y: 305, rx: 8, ry: 20, fill: false }
            ]
        },
        // 90. 脚
        {
            id: 'foot',
            name: '脚',
            icon: '🦶',
            paths: [
                { type: 'ellipse', x: 400, y: 330, rx: 35, ry: 70, fill: false },
                { type: 'ellipse', x: 375, y: 270, rx: 8, ry: 12, fill: false },
                { type: 'ellipse', x: 390, y: 265, rx: 8, ry: 13, fill: false },
                { type: 'ellipse', x: 405, y: 263, rx: 8, ry: 14, fill: false },
                { type: 'ellipse', x: 420, y: 265, rx: 8, ry: 13, fill: false },
                { type: 'ellipse', x: 435, y: 275, rx: 7, ry: 10, fill: false }
            ]
        }
    ],
    
    fantasy: [
        // 91. 龙
        {
            id: 'dragon',
            name: '龙',
            icon: '🐲',
            paths: [
                { type: 'bezier', points: [[350, 300], [380, 280], [420, 280], [450, 300]], fill: false },
                { type: 'bezier', points: [[450, 300], [470, 320], [470, 340], [450, 360]], fill: false },
                { type: 'triangle', points: [[340, 295], [325, 285], [340, 305]], fill: false },
                { type: 'triangle', points: [[340, 285], [325, 275], [340, 295]], fill: false },
                { type: 'circle', x: 365, y: 295, r: 5, fill: true },
                { type: 'bezier', points: [[450, 340], [480, 350], [500, 360], [510, 380]], fill: false },
                { type: 'triangle', points: [[380, 280], [375, 260], [385, 260]], fill: false },
                { type: 'triangle', points: [[420, 280], [415, 260], [425, 260]], fill: false }
            ]
        },
        // 92. 独角兽
        {
            id: 'unicorn',
            name: '独角兽',
            icon: '🦄',
            paths: [
                { type: 'ellipse', x: 380, y: 320, rx: 50, ry: 40, fill: false },
                { type: 'ellipse', x: 440, y: 300, rx: 35, ry: 25, fill: false },
                { type: 'triangle', points: [[440, 275], [435, 250], [445, 250]], fill: false },
                { type: 'triangle', points: [[460, 285], [465, 270], [455, 280]], fill: false },
                { type: 'circle', x: 450, y: 295, r: 5, fill: true },
                { type: 'bezier', points: [[420, 340], [440, 350], [460, 360], [470, 380]], fill: false }
            ]
        },
        // 93. 仙女
        {
            id: 'fairy',
            name: '仙女',
            icon: '🧚',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 25, fill: false },
                { type: 'ellipse', x: 400, y: 320, rx: 20, ry: 40, fill: false },
                { type: 'ellipse', x: 360, y: 300, rx: 25, ry: 15, fill: false },
                { type: 'ellipse', x: 440, y: 300, rx: 25, ry: 15, fill: false },
                { type: 'line', x1: 385, y1: 360, x2: 380, y2: 380 },
                { type: 'line', x1: 415, y1: 360, x2: 420, y2: 380 },
                { type: 'circle', x: 400, y: 250, r: 5, fill: false },
                { type: 'line', x1: 395, y1: 250, x2: 390, y2: 245 },
                { type: 'line', x1: 405, y1: 250, x2: 410, y2: 245 },
                { type: 'line', x1: 400, y1: 245, x2: 400, y2: 240 }
            ]
        },
        // 94. 美人鱼
        {
            id: 'mermaid',
            name: '美人鱼',
            icon: '🧜',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 30, fill: false },
                { type: 'ellipse', x: 400, y: 320, rx: 25, ry: 40, fill: false },
                { type: 'bezier', points: [[400, 360], [380, 380], [380, 400], [370, 420]], fill: false },
                { type: 'bezier', points: [[400, 360], [420, 380], [420, 400], [430, 420]], fill: false },
                { type: 'triangle', points: [[370, 420], [360, 430], [380, 430]], fill: false },
                { type: 'triangle', points: [[430, 420], [420, 430], [440, 430]], fill: false },
                { type: 'arc', x: 400, y: 260, r: 30, start: Math.PI, end: 0, fill: false }
            ]
        },
        // 95. 城堡
        {
            id: 'castle',
            name: '城堡',
            icon: '🏰',
            paths: [
                { type: 'rect', x: 340, y: 340, width: 120, height: 80, fill: false },
                { type: 'rect', x: 340, y: 320, width: 30, height: 20, fill: false },
                { type: 'rect', x: 385, y: 320, width: 30, height: 20, fill: false },
                { type: 'rect', x: 430, y: 320, width: 30, height: 20, fill: false },
                { type: 'triangle', points: [[340, 320], [355, 300], [370, 320]], fill: false },
                { type: 'triangle', points: [[385, 320], [400, 300], [415, 320]], fill: false },
                { type: 'triangle', points: [[430, 320], [445, 300], [460, 320]], fill: false },
                { type: 'rect', x: 380, y: 380, width: 40, height: 40, fill: false },
                { type: 'arc', x: 400, y: 380, r: 20, start: Math.PI, end: 0, fill: false }
            ]
        },
        // 96. 魔法棒
        {
            id: 'wand',
            name: '魔法棒',
            icon: '🪄',
            paths: [
                { type: 'line', x1: 350, y1: 350, x2: 450, y2: 250 },
                { type: 'polygon', points: [
                    [450, 250], [460, 245], [465, 255], [455, 260], [445, 255]
                ], fill: false },
                { type: 'circle', x: 470, y: 240, r: 3, fill: true },
                { type: 'circle', x: 475, y: 260, r: 3, fill: true },
                { type: 'circle', x: 460, y: 270, r: 3, fill: true },
                { type: 'circle', x: 445, y: 240, r: 3, fill: true }
            ]
        },
        // 97. 水晶球
        {
            id: 'crystal',
            name: '水晶球',
            icon: '🔮',
            paths: [
                { type: 'circle', x: 400, y: 300, r: 50, fill: false },
                { type: 'arc', x: 400, y: 300, r: 50, start: Math.PI*0.2, end: Math.PI*0.4, fill: false },
                { type: 'ellipse', x: 400, y: 360, rx: 35, ry: 15, fill: false },
                { type: 'rect', x: 380, y: 360, width: 40, height: 20, fill: false }
            ]
        },
        // 98. 巫师帽
        {
            id: 'wizard_hat',
            name: '巫师帽',
            icon: '🧙',
            paths: [
                { type: 'triangle', points: [[400, 250], [360, 350], [440, 350]], fill: false },
                { type: 'ellipse', x: 400, y: 350, rx: 50, ry: 15, fill: false },
                { type: 'polygon', points: [
                    [400, 280], [405, 290], [415, 290], [407, 297], 
                    [410, 307], [400, 300], [390, 307], [393, 297], 
                    [385, 290], [395, 290]
                ], fill: false },
                { type: 'circle', x: 400, y: 320, r: 5, fill: false }
            ]
        },
        // 99. 飞龙
        {
            id: 'flying_dragon',
            name: '飞龙',
            icon: '🐉',
            paths: [
                { type: 'bezier', points: [[350, 300], [370, 280], [430, 280], [450, 300]], fill: false },
                { type: 'ellipse', x: 370, y: 280, rx: 40, ry: 20, fill: false },
                { type: 'ellipse', x: 430, y: 280, rx: 40, ry: 20, fill: false },
                { type: 'triangle', points: [[340, 295], [320, 285], [340, 305]], fill: false },
                { type: 'circle', x: 360, y: 295, r: 5, fill: true },
                { type: 'bezier', points: [[450, 320], [480, 330], [500, 340], [510, 360]], fill: false }
            ]
        },
        // 100. 精灵
        {
            id: 'elf',
            name: '精灵',
            icon: '🧝',
            paths: [
                { type: 'circle', x: 400, y: 280, r: 35, fill: false },
                { type: 'triangle', points: [[365, 275], [355, 270], [365, 285]], fill: false },
                { type: 'triangle', points: [[435, 275], [445, 270], [435, 285]], fill: false },
                { type: 'circle', x: 385, y: 275, r: 5, fill: true },
                { type: 'circle', x: 415, y: 275, r: 5, fill: true },
                { type: 'arc', x: 400, y: 290, r: 15, start: 0, end: Math.PI, fill: false },
                { type: 'ellipse', x: 400, y: 340, rx: 30, ry: 50, fill: false }
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

// 导出模板数据
window.drawingTemplates = drawingTemplates;
window.drawTemplate = drawTemplate;