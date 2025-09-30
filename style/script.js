// script.js - 物理学习资源网站交互功能

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.gsc-index-item a');
    const sidebarSections = document.querySelectorAll('.sidebar-section');
    const moduleContents = document.querySelectorAll('.module-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const indexItems = document.querySelectorAll('.gsc-index-item');

    // 动态加载模块内容的函数
    function loadModule(moduleUrl, topicId = null) {
        // 显示加载状态
        const contentArea = document.getElementById('main-content-area') || document.querySelector('.module-content');
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
                    
                    // 如果有特定的主题ID，滚动到该位置
                    if (topicId) {
                        const targetElement = document.getElementById(topicId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    
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

    // 修改导航点击事件，支持动态加载
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新导航激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const module = this.getAttribute('data-module');
            const moduleUrl = this.getAttribute('data-url'); // 新增：获取模块URL
            
            // 如果有模块URL，使用动态加载
            if (moduleUrl) {
                loadModule(moduleUrl);
            } else {
                // 原有的显示/隐藏逻辑
                sidebarSections.forEach(section => section.style.display = 'none');
                moduleContents.forEach(content => content.style.display = 'none');
                
                const targetSidebar = document.getElementById(`${module}-sidebar`);
                const targetContent = document.getElementById(`${module}-content`);
                
                if (targetSidebar) targetSidebar.style.display = 'block';
                if (targetContent) targetContent.style.display = 'block';
                
                // 重置侧边栏链接激活状态
                if (targetSidebar) {
                    const firstLink = targetSidebar.querySelector('.sidebar-link');
                    if (firstLink) {
                        sidebarLinks.forEach(l => l.classList.remove('active'));
                        firstLink.classList.add('active');
                        
                        const topic = firstLink.getAttribute('data-topic');
                        showTopicContent(module, topic);
                    }
                }
            }
            
            // 移动端关闭菜单
            if (window.innerWidth <= 768) {
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // 修改侧边栏链接点击事件，支持动态加载
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const url = this.getAttribute('data-url');
                    if (url) {
                        // 更新侧边栏激活状态
                        sidebarLinks.forEach(l => l.closest('.gsc-index-item').classList.remove('active'));
                        this.closest('.gsc-index-item').classList.add('active');
                        
                        // 加载模块内容
                        loadModule(url);
                    } else {
                        // 处理展开/折叠
                        const parentItem = this.closest('.gsc-index-item');
                        if (parentItem.classList.contains('gsc-index-item-closed')) {
                            parentItem.classList.remove('gsc-index-item-closed');
                            parentItem.classList.add('gsc-index-item-open');
                        } else {
                            parentItem.classList.remove('gsc-index-item-open');
                            parentItem.classList.add('gsc-index-item-closed');
                        }
                    }
                });
            });

    // 显示特定主题内容（原有功能保留）
    function showTopicContent(module, topic) {
        const moduleContent = document.getElementById(`${module}-content`);
        if (moduleContent) {
            const topicSections = moduleContent.querySelectorAll('.topic-section');
            topicSections.forEach(section => section.style.display = 'none');
            
            const targetSection = document.getElementById(`${topic}-content`);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // 重新渲染MathJax公式（如果是动态内容）
                if (window.MathJax) {
                    MathJax.typeset();
                }
            }
        }
    }
    
    // 移动端菜单切换
    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
    });
	
	            // 初始化索引项点击事件（展开/折叠）
            indexItems.forEach(item => {
                const actionElements = item.querySelectorAll('.gsc-index-item-action');
                actionElements.forEach(action => {
                    action.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (item.classList.contains('gsc-index-item-closed')) {
                            item.classList.remove('gsc-index-item-closed');
                            item.classList.add('gsc-index-item-open');
                        } else {
                            item.classList.remove('gsc-index-item-open');
                            item.classList.add('gsc-index-item-closed');
                        }
                    });
                });
            });

    // 页面加载时可选：加载默认模块
    const defaultNavLink = document.querySelector('.nav-link.active, .nav-link:first-child');
    if (defaultNavLink) {
        const moduleUrl = defaultNavLink.getAttribute('data-url');
        if (moduleUrl) {
            loadModule(moduleUrl);
        }
    }
});