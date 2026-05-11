import os
import re
import shutil

BASE_DIR = "/Users/samrosa/DEV/3D/Advanced_HardcoreEngineer"
ASSETS_DIR = os.path.join(BASE_DIR, "assets", "images")
os.makedirs(ASSETS_DIR, exist_ok=True)

IMAGES = {
    "cad": "/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/engineering_cad_1777189659502.jpg",
    "print": "/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/industrial_3d_printing_1777189683184.jpg",
    "esp32": "/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/electronics_esp32_1777189704960.jpg",
    "robotics": "/Users/samrosa/.gemini/antigravity/brain/d86c0d5e-eb66-4d3c-a532-2fd514e9b29d/robotics_arm_1777189722122.jpg"
}

# Copy images
for name, path in IMAGES.items():
    if os.path.exists(path):
        shutil.copy(path, os.path.join(ASSETS_DIR, f"{name}.jpg"))

NEW_STYLE = """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        
        :root {
            --bg-color: #050508;
            --surface: rgba(18, 18, 26, 0.4);
            --surface-glass: rgba(10, 10, 15, 0.85);
            --primary: #00ffcc;
            --primary-glow: rgba(0, 255, 204, 0.4);
            --secondary: #0088aa;
            --text-main: #ffffff;
            --text-dim: #a0a0b0;
            --border: rgba(255, 255, 255, 0.08);
            --danger: #ff3366;
            --success: #33ff99;
            --gradient: linear-gradient(135deg, var(--primary), var(--secondary));
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { background-color: var(--bg-color); color: var(--text-main); line-height: 1.7; overflow-x: hidden; }
        
        /* Premium Background */
        .tech-bg {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-image: 
                radial-gradient(circle at 15% 50%, rgba(0, 255, 204, 0.08), transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(0, 136, 170, 0.08), transparent 50%),
                linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 100% 100%, 100% 100%, 60px 60px, 60px 60px;
            z-index: -2; pointer-events: none;
        }
        .glow-orb {
            position: fixed; top: -10%; left: 40%; width: 60vw; height: 60vw;
            background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%);
            z-index: -1; pointer-events: none; border-radius: 50%; opacity: 0.3; filter: blur(80px);
            animation: pulse 10s infinite alternate;
        }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.2; } 100% { transform: scale(1.2); opacity: 0.4; } }

        /* Nav */
        .navbar {
            position: sticky; top: 0; z-index: 100;
            background: var(--surface-glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border); padding: 18px 50px;
            display: flex; justify-content: space-between; align-items: center;
            box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .nav-brand { font-family: 'JetBrains Mono', monospace; color: #fff; font-weight: 800; font-size: 1.3rem; letter-spacing: 2px; display: flex; align-items: center; gap: 10px; }
        .nav-brand::before { content: ''; display: inline-block; width: 12px; height: 12px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }
        .nav-module { color: var(--primary); font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 3px; padding: 6px 12px; border: 1px solid rgba(0,255,204,0.3); border-radius: 20px; background: rgba(0,255,204,0.05); }

        /* Hero */
        .hero { padding: 100px 40px 60px; text-align: center; max-width: 1100px; margin: 0 auto; position: relative; }
        .hero h1 { font-size: 3.5rem; margin-bottom: 25px; font-weight: 800; letter-spacing: -1px; line-height: 1.2; }
        .hero h1 span { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.25rem; color: var(--text-dim); max-width: 800px; margin: 0 auto; font-weight: 300; }

        /* Main Content */
        .container { max-width: 1400px; margin: 0 auto; padding: 0 50px 100px 50px; display: grid; grid-template-columns: 2.5fr 1fr; gap: 50px; }
        @media (max-width: 1024px) { .container { grid-template-columns: 1fr; } }
        
        /* Glassmorphism Sections */
        .section { 
            background: var(--surface); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border); border-radius: 16px; padding: 40px; margin-bottom: 40px; 
            box-shadow: 0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .section:hover { border-color: rgba(0, 255, 204, 0.4); transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,255,204,0.1), inset 0 1px 0 rgba(255,255,255,0.1); }
        .section-title { font-family: 'JetBrains Mono', monospace; font-size: 1.6rem; color: #fff; margin-bottom: 25px; display: flex; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border); }
        .section-title span { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: 2rem; margin-right: 15px; }

        /* Typography & Lists */
        .knowledge-list { list-style: none; }
        .knowledge-list li { margin-bottom: 20px; padding-left: 40px; position: relative; font-size: 1.15rem; color: #e0e0e0; }
        .knowledge-list li::before { content: '►'; position: absolute; left: 0; top: 2px; color: var(--primary); font-size: 1rem; font-family: 'JetBrains Mono', monospace; }
        .list-desc { font-size: 0.95rem; color: var(--text-dim); margin-top: 8px; line-height: 1.6; font-weight: 300; }
        
        .debug-list { list-style: none; }
        .debug-list li { margin-bottom: 20px; padding: 20px; background: rgba(255, 51, 102, 0.05); border-left: 3px solid var(--danger); border-radius: 0 8px 8px 0; }
        .debug-list .err-code { color: var(--danger); font-family: 'JetBrains Mono', monospace; font-weight: 800; margin-right: 12px; font-size: 0.9rem; padding: 4px 8px; background: rgba(255,51,102,0.1); border-radius: 4px; }

        /* Code Block Premium */
        .code-container { border-radius: 12px; overflow: hidden; margin-top: 25px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .code-header { background: rgba(10, 10, 15, 0.9); padding: 12px 20px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #666; display: flex; align-items: center; border-bottom: 1px solid var(--border); }
        .mac-btn { width: 12px; height: 12px; border-radius: 50%; margin-right: 8px; }
        .mac-close { background: #ff5f56; } .mac-min { background: #ffbd2e; } .mac-max { background: #27c93f; }
        .code-title { margin-left: 15px; color: var(--text-dim); }
        pre { background: rgba(5, 5, 8, 0.8); padding: 25px; font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; color: var(--success); overflow-x: auto; line-height: 1.6; }

        /* Mission / Card */
        .mission-box { background: linear-gradient(145deg, rgba(0,255,204,0.08), rgba(0,136,170,0.02)); border: 1px solid rgba(0,255,204,0.3); border-radius: 16px; padding: 35px; position: relative; overflow: hidden; }
        .mission-box::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--primary); }
        .mission-title { color: #fff; font-size: 1.4rem; margin-bottom: 15px; font-weight: 800; display: flex; align-items: center; gap: 10px; }
        .mission-text { color: var(--text-dim); font-size: 1.1rem; font-weight: 300; }
        .status-badge { margin-top: 25px; display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.6); padding: 8px 16px; border: 1px solid var(--border); border-radius: 30px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-main); }
        .status-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 8px var(--primary); animation: blink 2s infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Sidebar Widgets */
        aside { display: flex; flex-direction: column; gap: 30px; }
        .widget { background: var(--surface); backdrop-filter: blur(16px); border: 1px solid var(--border); border-radius: 16px; padding: 30px; }
        .widget-title { font-size: 0.85rem; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dim); margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        
        .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.95rem; }
        .stat-row:last-child { border: none; padding-bottom: 0; }
        .stat-val { font-family: 'JetBrains Mono', monospace; color: var(--text-main); font-weight: bold; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; }
        
        /* Premium Image Display */
        .hero-image-container { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.6); margin-bottom: 20px; }
        .hero-image-container::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; box-shadow: inset 0 0 20px rgba(0,0,0,0.5); pointer-events: none; }
        .hero-image { width: 100%; height: auto; display: block; transition: transform 0.5s ease; }
        .hero-image-container:hover .hero-image { transform: scale(1.05); }
        .img-caption { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-dim); text-align: center; letter-spacing: 1px; }

        .instructor-note { background: rgba(0, 255, 204, 0.05); border: 1px solid rgba(0, 255, 204, 0.2); border-radius: 12px; padding: 25px; position: relative; }
        .instructor-note::before { content: '”'; position: absolute; top: 10px; right: 20px; font-size: 4rem; color: rgba(0,255,204,0.1); font-family: serif; line-height: 1; }
    </style>
"""

# Categorize topics
def get_image_for_lesson(title):
    if "SolidWorks" in title or "制图" in title or "三视图" in title or "草图" in title or "尺寸" in title or "工程图" in title or "特征" in title or "装配" in title or "机械零件" in title or "齿轮" in title or "底盘" in title or "干涉" in title or "有限元" in title:
        return "../assets/images/cad.jpg"
    elif "打印" in title or "悬垂" in title or "支撑" in title or "质量属性" in title or "材料" in title:
        return "../assets/images/print.jpg"
    elif "ESP32" in title or "电路" in title or "I2C" in title or "电源" in title or "传感器" in title or "串口" in title or "蓝牙" in title or "通信" in title or "PWM" in title or "定时器" in title:
        return "../assets/images/esp32.jpg"
    else:
        return "../assets/images/robotics.jpg"

for root, dirs, files in os.walk(BASE_DIR):
    for file in files:
        if file == "index.html":
            filepath = os.path.join(root, file)
            lesson_name = os.path.basename(root)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace style
            content = re.sub(r'<style>.*?</style>', NEW_STYLE, content, flags=re.DOTALL)
            
            # Format Hero H1 to have span for gradient
            content = re.sub(r'<h1>(.*?)</h1>', r'<h1><span>\1</span></h1>', content)
            
            # Update knowledge-list desc
            content = content.replace('<div style="font-size:0.95rem; color:var(--text-dim); margin-top:5px;">', '<div class="list-desc">')
            
            # Update Code Header
            content = re.sub(
                r'<div class="code-header">.*?<span style="margin-left:10px;">(.*?)</span>.*?</div>',
                r'<div class="code-header"><div class="mac-btn mac-close"></div><div class="mac-btn mac-min"></div><div class="mac-btn mac-max"></div><span class="code-title">\1</span></div>',
                content, flags=re.DOTALL
            )
            
            # Update Mission
            content = re.sub(
                r'<div style="margin-top: 20px; display: inline-block;.*?STATUS: PENDING_USER_EXECUTION</div>',
                r'<div class="status-badge"><div class="status-dot"></div>SYS_STATUS: PENDING_USER_EXECUTION</div>',
                content, flags=re.DOTALL
            )
            
            # Update Image
            img_path = get_image_for_lesson(lesson_name)
            img_html = f'''<div class="hero-image-container">
                    <img src="{img_path}" alt="Engineering Schematic" class="hero-image">
                </div>
                <div class="img-caption">FIG 1.0 - CORE SYSTEM TOPOLOGY</div>'''
            
            content = re.sub(r'<img src=".*?" alt="Engineering Schematic" class="hero-image">.*?</div>', img_html, content, flags=re.DOTALL)
            
            # Wrap image correctly if old was single tag
            content = re.sub(r'<!-- IMAGE PLACEHOLDER REPLACED WITH REAL GENERATED IMAGE based on topic -->\s*<img src=".*?" alt="Engineering Schematic" class="hero-image">', img_html, content, flags=re.DOTALL)
            
            # Instructor note
            content = content.replace('style="background: rgba(0, 255, 204, 0.05); border-color: var(--primary);"', 'class="instructor-note"')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("UI successfully updated for all 48 lessons!")
