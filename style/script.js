// script.js - 数学学习资源网站交互功能

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const indexItems = document.querySelectorAll('.gsc-index-item');

    // 动态加载模块内容的函数
    function loadModule(moduleUrl) {
        const contentArea = document.getElementById('main-content-area');
        if (contentArea) {
            contentArea.innerHTML = '<div class="loading">加载中...</div>';
            
            fetch(moduleUrl)
                .then(response => {
                    if (!response.ok) throw new Error('网络响应不正常');
                    return response.text();
                })
                .then(html => {
                    contentArea.innerHTML = html;
                    if (window.MathJax) MathJax.typeset();
                })
                .catch(error => {
                    console.error('加载模块时出错:', error);
                    contentArea.innerHTML = '<div class="error">加载内容时出错，请稍后重试。</div>';
                });
        }
    }

    // 顶部导航点击事件
    navLinks.forEach(link => { 
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

// 侧边栏项目点击事件 - 修正版本
indexItems.forEach(item => {
    const link = item.querySelector('a');
    const children = item.querySelector('.gsc-index-item-children');
    
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 检查是否有子菜单
        if (children) {
            // 有子菜单：只处理展开/折叠，不加载内容
            e.stopPropagation(); // 阻止事件冒泡
            
            // 切换展开状态
            const isClosed = item.classList.contains('gsc-index-item-closed');
            
            // 先关闭所有同级菜单（可选）
            const siblings = Array.from(item.parentElement.children);
            siblings.forEach(sibling => {
                if (sibling !== item && sibling.classList.contains('gsc-index-item-open')) {
                    sibling.classList.remove('gsc-index-item-open');
                    sibling.classList.add('gsc-index-item-closed');
                }
            });
            
            // 切换当前项状态
            if (isClosed) {
                item.classList.remove('gsc-index-item-closed');
                item.classList.add('gsc-index-item-open');
            } else {
                item.classList.remove('gsc-index-item-open');
                item.classList.add('gsc-index-item-closed');
            }
        } 
		
		// 没有子菜单：加载内容
        const url = this.getAttribute('data-url');
        if (url) {
            // 移除其他项的active状态
            indexItems.forEach(i => i.classList.remove('active'));
            // 添加当前项active状态
            item.classList.add('active');
            // 加载模块内容
            loadModule(url);
        }

    });
});

    // 移动端菜单切换
    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });

    // 初始化：默认展开第一个主要分类
    const firstMainItem = document.querySelector('.gsc-index-item');
    if (firstMainItem) {
        firstMainItem.classList.remove('gsc-index-item-closed');
        firstMainItem.classList.add('gsc-index-item-open');
    }
});