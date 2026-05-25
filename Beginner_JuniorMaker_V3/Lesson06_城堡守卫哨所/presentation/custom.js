document.addEventListener('DOMContentLoaded', () => {
    const visualSide = document.querySelector('.visual-side');
    const scene = document.querySelector('.scene');
    
    let autoRotate = true;
    let angle = 45;

    // 1. 旋转 3D 场景
    function rotateScene() {
        if(autoRotate && scene) {
            angle += 0.5;
            scene.style.transform = `rotateX(-20deg) rotateY(${angle}deg)`;
        }
        requestAnimationFrame(rotateScene);
    }
    if(scene) rotateScene();

    if(visualSide) {
        visualSide.addEventListener('mouseenter', () => autoRotate = false);
        visualSide.addEventListener('mouseleave', () => autoRotate = true);
    }

    // 2. 全息控制面板及联动核心
    const gateHeightSlider = document.getElementById('gate-height-slider');
    const gateWidthSlider = document.getElementById('gate-width-slider');
    const scanSlider = document.getElementById('scan-slider');
    
    const gateHeightVal = document.getElementById('gate-height-val');
    const gateWidthVal = document.getElementById('gate-width-val');
    const scanVal = document.getElementById('scan-val');
    
    const tacticalFeedback = document.getElementById('tactical-feedback');
    const holoOutpost = document.querySelector('.holo-outpost');
    const holoGate = document.querySelector('.holo-gate');
    const scanLaserLine = document.querySelector('.scan-laser-line');
    
    const sliceCanvas = document.getElementById('slice-canvas');
    const sliceDesc = document.getElementById('slice-desc');

    const scale = 2.0; // 1mm = 2px 的比例
    const outpostW = 120; // 60mm 宽 = 120px
    const outpostH = 160; // 80mm 高 = 160px
    const outpostD = 120; // 60mm 深 = 120px

    // 设置哨所初始固定样式
    if (holoOutpost) {
        holoOutpost.style.setProperty('--w', `${outpostW}px`);
        holoOutpost.style.setProperty('--h', `${outpostH}px`);
        holoOutpost.style.setProperty('--d', `${outpostD}px`);
        holoOutpost.style.setProperty('--transZ', `${outpostH / 2}px`); // 抬升 Z 轴，底面切齐 Z=0 网格
    }

    function updateHoloParameters() {
        if (!gateHeightSlider || !gateWidthSlider) return;

        const gateHeight = parseFloat(gateHeightSlider.value);
        const gateWidth = parseFloat(gateWidthSlider.value);

        // 数值回显
        if (gateHeightVal) gateHeightVal.innerText = gateHeight.toFixed(0);
        if (gateWidthVal) gateWidthVal.innerText = gateWidth.toFixed(0);

        // 3. 计算红色大门负零件 3D 尺寸
        const gateW = gateWidth * scale;
        const gateH = gateHeight * scale;
        const gateD = 40 * scale; // 深度固定为 80px

        if (holoGate) {
            holoGate.style.setProperty('--gw', `${gateW}px`);
            holoGate.style.setProperty('--gh', `${gateH}px`);
            holoGate.style.setProperty('--gd', `${gateD}px`);
            holoGate.style.setProperty('--gz', '0px'); // 贴地开洞
        }

        // 4. clip-path 实时开槽百分比计算
        // 门宽一半占外宽 60mm 的比例
        const ratio = (gateWidth / 2) / 30;
        const lEdge = 50 - (ratio * 50);
        const rEdge = 50 + (ratio * 50);
        const gateHPct = 100 - (gateHeight / 80 * 100);

        const faceFront = document.querySelector('.holo-outpost .face.front');
        if (faceFront) {
            if (gateHeight > 0 && gateWidth > 0) {
                faceFront.classList.add('cut-gate');
                holoOutpost.style.setProperty('--l-edge', `${lEdge}%`);
                holoOutpost.style.setProperty('--r-edge', `${rEdge}%`);
                holoOutpost.style.setProperty('--gate-h-pct', `${gateHPct}%`);
            } else {
                faceFront.classList.remove('cut-gate');
            }
        }

        // 5. 哨所承重安全检测与断裂判定
        if (tacticalFeedback && holoOutpost && visualSide) {
            holoOutpost.classList.remove('fractured');
            visualSide.classList.remove('alarm-active');
            tacticalFeedback.className = '';

            if (gateHeight >= 55) {
                // 顶部切空断裂
                holoOutpost.classList.add('fractured');
                visualSide.classList.add('alarm-active');
                tacticalFeedback.classList.add('status-fail');
                tacticalFeedback.innerHTML = `🚨 战略灾难：拱门切削高度 (${gateHeight}mm) 过高！高塔顶部承重不足 5mm，发生结构崩塌解体！`;
            } else if (gateWidth >= 52) {
                // 两侧过薄断裂
                holoOutpost.classList.add('fractured');
                visualSide.classList.add('alarm-active');
                tacticalFeedback.classList.add('status-fail');
                tacticalFeedback.innerHTML = `🚨 战略灾难：拱门开口宽度 (${gateWidth}mm) 过宽！两侧承重柱厚度低于 4mm，导致哨所整体受重力粉碎倾裂！`;
            } else if (gateHeight === 0 || gateWidth === 0) {
                tacticalFeedback.classList.add('status-warn');
                tacticalFeedback.innerHTML = '⚠️ 警报：没有开凿大门卡槽，城墙将无法完成插接拼装！';
            } else if (gateHeight < 15 || gateWidth < 15) {
                tacticalFeedback.classList.add('status-warn');
                tacticalFeedback.innerHTML = `⚠️ 警报：卡槽尺寸偏小。3D 打印收缩会导致配合间隙不足，拼装时容易卡死！`;
            } else {
                tacticalFeedback.classList.add('status-pass');
                tacticalFeedback.innerHTML = `✅ 配合完美：凹槽宽 ${gateWidth}mm，高 ${gateHeight}mm。立柱厚度与底盘承重强度完美达标，合格！`;
            }
        }

        // 刷新切片画布以防零件尺寸更改后切片图没有刷新
        drawSlicingPreview();
    }

    // 6. Canvas 绘制切片截面
    function drawSlicingPreview() {
        if (!sliceCanvas || !scanSlider) return;

        const ctx = sliceCanvas.getContext('2d');
        const scanH = parseFloat(scanSlider.value);
        const gateHeight = parseFloat(gateHeightSlider.value);
        const gateWidth = parseFloat(gateWidthSlider.value);

        if (scanVal) scanVal.innerText = scanH.toFixed(0);

        // 激光指示线移动 (Z 轴像素定位)
        if (scanLaserLine) {
            scanLaserLine.style.setProperty('--sz', `${scanH * scale}px`);
        }

        // 清空画布
        ctx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);

        // 设置激光绿画笔样式
        ctx.strokeStyle = '#34c759';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#34c759';
        ctx.shadowBlur = 6;
        ctx.fillStyle = 'rgba(52, 199, 89, 0.15)';

        // 居中偏移量计算 (让 60x60mm 映射为 80x80px 绘制)
        const sizePx = 60 * scale; // 120px 宽的哨所在 canvas 里等比例缩小到 80px 绘制
        const halfSize = sizePx / 2; // 40px
        const cx = sliceCanvas.width / 2; // 60
        const cy = sliceCanvas.height / 2; // 60

        // 开始分层投影路径绘制
        ctx.beginPath();

        if (scanH >= 80) {
            // 超出塔顶
            if (sliceDesc) sliceDesc.innerHTML = `当前高度: ${scanH}mm<br>截面: 超出防御塔顶面`;
            return;
        }

        if (scanH < gateHeight && gateWidth > 0) {
            // 处于大门凹槽切除高度内，绘制 U 型截面
            // 外框为 80x80px 的正方形，大门在 Y 前侧切入(相当于 canvas 的下半边切掉)
            // 大门深度在此投影中表现为切去下方矩形：宽度为 gateWidth * scale * 0.67，高度为 40 * scale * 0.67
            const gW = (gateWidth / 60) * sizePx; // 转换到 canvas 尺寸比例下的门宽
            const leftX = cx - gW / 2;
            const rightX = cx + gW / 2;
            
            // 顺时针绘制 U 型截面
            ctx.moveTo(cx - halfSize, cy - halfSize); // 左上
            ctx.lineTo(cx + halfSize, cy - halfSize); // 右上
            ctx.lineTo(cx + halfSize, cy + halfSize); // 右下
            ctx.lineTo(rightX, cy + halfSize);        // 门洞右侧
            ctx.lineTo(rightX, cy - halfSize + 15);   // 门洞内缩 (15px 深度)
            ctx.lineTo(leftX, cy - halfSize + 15);    // 门洞左侧内缩
            ctx.lineTo(leftX, cy + halfSize);         // 门洞左侧
            ctx.lineTo(cx - halfSize, cy + halfSize); // 左下
            ctx.closePath();
            
            if (sliceDesc) sliceDesc.innerHTML = `当前高度: ${scanH}mm<br>截面: U型卡接立柱图层`;
        } else {
            // 实心正方形截面
            ctx.rect(cx - halfSize, cy - halfSize, sizePx, sizePx);
            if (sliceDesc) sliceDesc.innerHTML = `当前高度: ${scanH}mm<br>截面: 完整闭合实心塔身`;
        }

        ctx.fill();
        ctx.stroke();
    }

    // 绑定联动事件
    if (gateHeightSlider) gateHeightSlider.addEventListener('input', updateHoloParameters);
    if (gateWidthSlider) gateWidthSlider.addEventListener('input', updateHoloParameters);
    if (scanSlider) scanSlider.addEventListener('input', drawSlicingPreview);

    // 初始参数渲染
    updateHoloParameters();
});
