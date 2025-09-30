// script.js - 数学学习资源网站交互功能

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const indexItems = document.querySelectorAll('.gsc-index-item');

    // 动态加载模块内容的函数
    function loadModule(moduleUrl, topicId = null) {
        // 显示加载状态
        const contentArea = document.getElementById('main-content-area');
        if (contentArea) {
            contentArea.innerHTML = '<div class="loading">加载中...</div>';
        }
        
        // 使用fetch API加载模块内容
        fetch(moduleUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络响应不正常');
                }
                return response.text();
            })
            .then(html => {
                // 将加载的内容插入到内容区域
                if (contentArea) {
                    contentArea.innerHTML = html;
                    
                    // 重新渲染MathJax公式
                    if (window.MathJax) {
                        MathJax.typeset();
                    }
                }
            })
            .catch(error => {
                console.error('加载模块时出错:', error);
                if (contentArea) {
                    contentArea.innerHTML = 
                        '<div class="error">加载内容时出错，请稍后重试。</div>';
                }
            });
    }

    // 顶部导航点击事件 - 修复
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除 active 类从所有导航链接
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加 active 类到当前点击的链接
            this.classList.add('active');
            
            // 移动端关闭菜单
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // 侧边栏项目点击事件 - 完全重写
    indexItems.forEach(item => {
        const link = item.querySelector('a');
        const actionBtn = item.querySelector('.gsc-index-item-action');
        const children = item.querySelector('.gsc-index-item-children');
        
        // 如果有子菜单，处理展开/折叠
        if (children) {
            // 主链接点击 - 切换展开/折叠
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                toggleItem(item);
            });
            
            // 动作按钮点击 - 同样切换展开/折叠
            if (actionBtn) {
                actionBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    toggleItem(item);
                });
            }
        } else {
            // 没有子菜单的项 - 加载内容
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const url = this.getAttribute('data-url');
                if (url) {
                    // 移除所有active类
                    indexItems.forEach(i => i.classList.remove('active'));
                    // 添加active类到当前项
                    item.classList.add('active');
                    
                    // 加载内容
                    loadModule(url);
                }
            });
        }
    });

    // 切换项目展开/折叠状态的函数
    function toggleItem(item) {
        const isClosed = item.classList.contains('gsc-index-item-closed');
        const isOpen = item.classList.contains('gsc-index-item-open');
        
        if (isClosed) {
            item.classList.remove('gsc-index-item-closed');
            item.classList.add('gsc-index-item-open');
        } else if (isOpen) {
            item.classList.remove('gsc-index-item-open');
            item.classList.add('gsc-index-item-closed');
        } else {
            // 初始状态处理
            item.classList.add('gsc-index-item-open');
        }
    }

    // 移动端菜单切换
    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });
});