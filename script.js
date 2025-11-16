// 平滑滚动到相册
function scrollToGallery() {
    document.getElementById('gallery').scrollIntoView({
        behavior: 'smooth'
    });
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加猫咪叫声效果
    addCatSoundEffects();

    // 添加照片懒加载效果
    addLazyLoading();

    // 添加滚动动画
    addScrollAnimations();

    // 添加时间显示
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // 添加猫咪信息编辑功能
    addCatInfoEditor();

    // 添加主题切换功能
    addThemeToggle();

    // 添加猫咪小动画
    addCatAnimations();

    // 添加图片点击放大功能
    addImageLightbox();
});

// 猫咪叫声效果
function addCatSoundEffects() {
    const catSounds = ['喵~', 'Meow~', '喵喵~', 'Purr~', '嗷呜~'];

    document.addEventListener('click', function(e) {
        if (Math.random() < 0.1) { // 10%概率触发
            showCatSound(catSounds[Math.floor(Math.random() * catSounds.length)], e.pageX, e.pageY);
        }
    });
}

function showCatSound(sound, x, y) {
    const soundBubble = document.createElement('div');
    soundBubble.textContent = sound;
    soundBubble.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background: #ff6b6b;
        color: white;
        padding: 10px 15px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 1000;
        animation: floatUp 2s ease-out forwards;
        pointer-events: none;
    `;

    document.body.appendChild(soundBubble);

    setTimeout(() => {
        soundBubble.remove();
    }, 2000);
}

// 添加懒加载效果
function addLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
        // 添加错误处理
        img.addEventListener('error', function() {
            this.classList.add('error');
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
        });

        // 为不支持懒加载的浏览器提供后备方案
        if ('loading' in HTMLImageElement.prototype) {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        } else {
            // 使用 Intersection Observer 作为后备
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            imageObserver.observe(img);
        }
    });
}

// 滚动动画
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// 更新时间显示
function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    let timeDisplay = document.getElementById('current-time');
    if (!timeDisplay) {
        timeDisplay = document.createElement('div');
        timeDisplay.id = 'current-time';
        timeDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255,255,255,0.9);
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            color: #666;
            z-index: 1000;
        `;
        document.body.appendChild(timeDisplay);
    }

    timeDisplay.textContent = timeString;
}

// 猫咪信息编辑功能
function addCatInfoEditor() {
    const editableFields = ['cat-name', 'cat-age', 'cat-breed', 'cat-gender', 'cat-personality'];

    editableFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.style.cursor = 'pointer';
            element.title = '点击编辑';

            element.addEventListener('click', function() {
                const currentValue = this.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.style.cssText = `
                    background: #fff;
                    border: 2px solid #ff6b6b;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: inherit;
                `;

                this.textContent = '';
                this.appendChild(input);
                input.focus();
                input.select();

                const saveEdit = () => {
                    this.textContent = input.value || currentValue;
                    showNotification('信息已更新！');
                };

                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
            });
        }
    });
}

// 主题切换功能
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: #ff6b6b;
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    document.body.appendChild(themeToggle);

    let isDarkMode = false;

    themeToggle.addEventListener('click', function() {
        isDarkMode = !isDarkMode;

        if (isDarkMode) {
            document.body.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
            this.innerHTML = '☀️';
            document.documentElement.style.setProperty('--text-color', 'white');
        } else {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.innerHTML = '🌙';
            document.documentElement.style.setProperty('--text-color', '#333');
        }

        this.style.transform = isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    themeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(10deg)';
    });

    themeToggle.addEventListener('mouseleave', function() {
        this.style.transform = isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)';
    });
}

// 猫咪小动画
function addCatAnimations() {
    // 创建跟随鼠标的小猫爪印
    let mouseTimer;

    document.addEventListener('mousemove', function(e) {
        clearTimeout(mouseTimer);
        mouseTimer = setTimeout(() => {
            if (Math.random() < 0.05) { // 5%概率显示爪印
                createPawPrint(e.pageX, e.pageY);
            }
        }, 100);
    });
}

function createPawPrint(x, y) {
    const paw = document.createElement('div');
    paw.innerHTML = '🐾';
    paw.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        opacity: 0.6;
        z-index: 999;
        animation: fadeOut 3s ease-out forwards;
        pointer-events: none;
    `;

    document.body.appendChild(paw);

    setTimeout(() => {
        paw.remove();
    }, 3000);
}

// 通知功能
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 2000;
        animation: notificationPop 2s ease-out forwards;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// 图片灯箱功能
function addImageLightbox() {
    const galleryImages = document.querySelectorAll('.photo-item img');
    const heroImage = document.querySelector('.hero-image img');

    // 为所有图片添加点击事件
    [...galleryImages, heroImage].forEach(img => {
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                createLightbox(this.src, this.alt);
            });
        }
    });
}

function createLightbox(imageSrc, imageAlt) {
    // 创建背景遮罩
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;

    // 创建大图片
    const largeImage = document.createElement('img');
    largeImage.src = imageSrc;
    largeImage.alt = imageAlt;
    largeImage.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        animation: zoomIn 0.3s ease;
        cursor: pointer;
    `;

    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 40px;
        background: rgba(255, 255, 255, 0.8);
        border: none;
        color: #333;
        font-size: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 3001;
    `;

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 1)';
        closeBtn.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.8)';
        closeBtn.style.transform = 'scale(1)';
    });

    // 关闭功能
    function closeLightbox() {
        overlay.style.animation = 'fadeOutLightbox 0.3s ease';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeLightbox();
        }
    });

    largeImage.addEventListener('click', closeLightbox);

    // ESC键关闭
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // 组装灯箱
    overlay.appendChild(largeImage);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    // 防止背景滚动
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 300);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0px);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px);
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 0.6;
            transform: scale(1) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) rotate(15deg);
        }
    }

    @keyframes notificationPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        40% {
            transform: translate(-50%, -50%) scale(0.95);
        }
        60% {
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }

    @keyframes animate-in {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-in {
        animation: animate-in 0.6s ease-out forwards;
    }

    img.loaded {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeOutLightbox {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    @keyframes zoomIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    /* 图片加载错误处理 */
    img.error {
        background: #f0f0f0 url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>') center/50px no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 14px;
        min-height: 200px;
    }

    img.error::after {
        content: "图片加载失败";
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
    }
`;
document.head.appendChild(style);