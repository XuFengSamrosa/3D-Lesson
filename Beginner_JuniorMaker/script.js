document.addEventListener('DOMContentLoaded', () => {
    const lessonGrid = document.getElementById('lesson-grid');
    
    const lessons = [
        { id: 1, title: "初识数字制造", icon: "🚀", folder: "Lesson01_初识数字制造" },
        { id: 2, title: "我的名字徽章", icon: "📛", folder: "Lesson02_我的名字徽章" },
        { id: 3, title: "积木搭建大师", icon: "🏰", folder: "Lesson03_积木搭建大师" },
        { id: 4, title: "几何动物园", icon: "🐘", folder: "Lesson04_几何动物园" },
        { id: 5, title: "几何空间奥秘", icon: "🧊", folder: "Lesson05_几何空间奥秘" },
        { id: 6, title: "桌面小管家", icon: "🗂️", folder: "Lesson06_桌面小管家" },
        { id: 7, title: "迷你景观配件", icon: "🏡", folder: "Lesson07_迷你景观配件" },
        { id: 8, title: "旋转陀螺大赛", icon: "🌪️", folder: "Lesson08_旋转陀螺大赛" },
        { id: 9, title: "镂空灯罩设计", icon: "💡", folder: "Lesson09_镂空灯罩设计" },
        { id: 10, title: "关节可动小人", icon: "🤖", folder: "Lesson10_关节可动小人" },
        { id: 11, title: "创意手机支架", icon: "📱", folder: "Lesson11_创意手机支架" },
        { id: 12, title: "拓竹A1大变身", icon: "🔧", folder: "Lesson12_拓竹A1大变身" },
        { id: 13, title: "梦想社区规划", icon: "🗺️", folder: "Lesson13_梦想社区规划" },
        { id: 14, title: "梦想社区建模", icon: "🏗️", folder: "Lesson14_梦想社区建模" },
        { id: 15, title: "打印与组装", icon: "🧩", folder: "Lesson15_打印与组装" },
        { id: 16, title: "作品发布会", icon: "🌟", folder: "Lesson16_作品发布会" }
    ];

    lessons.forEach(lesson => {
        const a = document.createElement('a');
        a.href = `${lesson.folder}/index.html`;
        a.className = 'lesson-card';
        
        a.innerHTML = `
            <div class="lesson-icon">${lesson.icon}</div>
            <div class="lesson-id">LESSON ${lesson.id.toString().padStart(2, '0')}</div>
            <div class="lesson-title">${lesson.title}</div>
        `;
        
        lessonGrid.appendChild(a);
    });
});
