// 模块上下滑动交互效果 
function initScrollAnimations() {
    // 获取所有需要动画效果的卡片和模块
    const animatedElements = document.querySelectorAll('.card:not(.life-gallery-card), .contact-full-section, .about-module');
    
    // 设置初始状态
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // 添加自定义属性标记动画状态
        element.setAttribute('data-animated', 'false');
    });
    
    // 创建Intersection Observer来检测元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 只有当元素之前没有被动画过时才执行动画
                if (entry.target.getAttribute('data-animated') === 'false') {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.setAttribute('data-animated', 'true');
                    }, 100);
                }
            } else {
                // 只有当元素完全离开视口时才重置动画状态
                const rect = entry.target.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) {
                    // 重置动画状态，但不立即重置样式，等待下一次进入视口
                    entry.target.setAttribute('data-animated', 'false');
                }
            }
        });
    }, {
        threshold: 0.2, // 提高阈值确保更多内容可见时触发
        rootMargin: '0px 0px -100px 0px' // 调整底部margin
    });
    
    // 观察所有需要动画的元素
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 页面加载时立即检查一次可见元素
    window.addEventListener('load', () => {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.setAttribute('data-animated', 'true');
                }, 100);
            }
        });
    });
    
    // 添加滚动事件监听器，确保滚动时也能触发动画
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;
        
        // 检查所有动画元素
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInViewport && element.getAttribute('data-animated') === 'false') {
                // 元素在视口中但尚未动画
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.setAttribute('data-animated', 'true');
                }, 100);
            } else if (!isInViewport && element.getAttribute('data-animated') === 'true') {
                // 元素离开视口，重置动画状态
                if ((scrollDirection === 'down' && rect.top > window.innerHeight) || 
                    (scrollDirection === 'up' && rect.bottom < 0)) {
                    element.setAttribute('data-animated', 'false');
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(50px)';
                }
            }
        });
    }, { passive: true });
}

// 初始化滚动动画效果
document.addEventListener('DOMContentLoaded', initScrollAnimations);
// 夜间模式切换
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// 导航高亮
const navLinks = document.querySelectorAll('.menu a');
window.addEventListener('scroll', () => {
    let fromTop = window.scrollY + 80;
    navLinks.forEach(link => {
        let section = document.querySelector(link.getAttribute('href'));
        if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// 背景轮播
const heroBgImages = document.querySelectorAll('.hero-bg img');
let heroBgIndex = 0;
function showHeroBg(index) {
    heroBgImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}
function nextHeroBg() {
    heroBgIndex = (heroBgIndex + 1) % heroBgImages.length;
    showHeroBg(heroBgIndex);
}
setInterval(nextHeroBg, 5000);

// 项目卡片点击跳转
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) window.open(url, '_blank');
    });
});
document.querySelectorAll('.project-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        const card = btn.closest('.project-card');
        const url = card.getAttribute('data-url');
        if (url) window.open(url, '_blank');
    });
});
// 生活剪影轮播（横排自动滑动，循环显示多张）
const lifeTrack = document.querySelector('.life-carousel-track');
if (lifeTrack) {
    let offset = 0;
    function getVisibleCount() {
        // 每屏显示几张，和CSS flex宽度一致
        if (window.innerWidth < 900) return 2;
        if (window.innerWidth < 1200) return 3;
        return 4;
    }
    function getItemWidth() {
        return lifeTrack.children[0].offsetWidth + 24; // margin
    }
    function slide() {
        const itemCount = lifeTrack.children.length;
        const visibleCount = getVisibleCount();
        offset = (offset + 1) % (itemCount - visibleCount + 1);
        lifeTrack.style.transform = `translateX(-${offset * getItemWidth()}px)`;
    }
    let interval = setInterval(slide, 3000);
    window.addEventListener('resize', () => {
        // 重新计算宽度和位置
        lifeTrack.style.transform = `translateX(-${offset * getItemWidth()}px)`;
    });
}

// 课程卡片动态效果
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});
// 联系方式图片轮播
const carouselImgs = document.querySelectorAll('.carousel-img');
let carouselIndex = 0;
setInterval(() => {
    carouselImgs.forEach((img, i) => img.classList.toggle('active', i === carouselIndex));
    carouselIndex = (carouselIndex + 1) % carouselImgs.length;
}, 3000);

// 联系表单交互
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = '感谢您的留言！我们会尽快回复您。';
    formMessage.style.opacity = 1;
    setTimeout(() => {
        formMessage.style.opacity = 0;
    }, 3000);
    contactForm.reset();
});

