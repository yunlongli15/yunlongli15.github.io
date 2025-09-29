// script.js - 物理学习资源网站交互功能

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebarSections = document.querySelectorAll('.sidebar-section');
    const moduleContents = document.querySelectorAll('.module-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    // 顶部导航点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
        e.preventDefault();
                    
        // 更新导航激活状态
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
                    
                    const module = this.getAttribute('data-module');
                    
                    // 隐藏所有侧边栏和内容
                    sidebarSections.forEach(section => section.style.display = 'none');
                    moduleContents.forEach(content => content.style.display = 'none');
                    
                    // 显示对应的侧边栏和内容
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
                            
                            // 显示对应的内容
                            const topic = firstLink.getAttribute('data-topic');
                            showTopicContent(module, topic);
                        }
                    }
                    
                    // 移动端关闭菜单
                    if (window.innerWidth <= 768) {
                        navLinksContainer.classList.remove('active');
                    }
                });
            });

            // 侧边栏链接点击事件
            sidebarLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const sidebarSection = this.closest('.sidebar-section');
                    const module = sidebarSection.id.replace('-sidebar', '');
                    const topic = this.getAttribute('data-topic');
                    
                    // 更新侧边栏激活状态
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 显示对应内容
                    showTopicContent(module, topic);
                });
            });

            // 显示特定主题内容
            function showTopicContent(module, topic) {
                // 隐藏该模块下的所有主题内容
                const moduleContent = document.getElementById(`${module}-content`);
                const topicSections = moduleContent.querySelectorAll('.topic-section');
                topicSections.forEach(section => section.style.display = 'none');
                
                // 显示目标主题内容
                const targetSection = document.getElementById(`${topic}-content`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                }
            }
            
            // 移动端菜单切换
            mobileMenuBtn.addEventListener('click', function() {
                navLinksContainer.classList.toggle('active');
            });
        }