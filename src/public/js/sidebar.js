document.addEventListener('DOMContentLoaded', () => {
  const desktopSidebar = document.getElementById('desktopSidebar');
  const toggleDesktopBtn = document.getElementById('toggleDesktopSidebarBtn');
  const toggleDesktopIcon = document.getElementById('toggleDesktopSidebarIcon');

  const mobileDrawer = document.getElementById('mobileSidebarDrawer');
  const mobilePanel = document.getElementById('mobileSidebarPanel');
  const mobileBackdrop = document.getElementById('mobileSidebarBackdrop');
  const openMobileBtn = document.getElementById('openMobileSidebarBtn');
  const closeMobileBtn = document.getElementById('closeMobileSidebarBtn');

  // --- Desktop Collapse / Expand ---
  if (desktopSidebar && toggleDesktopBtn) {
    // Read saved preference
    const isCollapsed = localStorage.getItem('wms_sidebar_collapsed') === 'true';
    if (isCollapsed) {
      desktopSidebar.classList.add('collapsed');
      if (toggleDesktopIcon) {
        toggleDesktopIcon.classList.remove('fa-angles-left');
        toggleDesktopIcon.classList.add('fa-angles-right');
      }
    }

    toggleDesktopBtn.addEventListener('click', () => {
      const currentlyCollapsed = desktopSidebar.classList.toggle('collapsed');
      localStorage.setItem('wms_sidebar_collapsed', currentlyCollapsed ? 'true' : 'false');
      
      if (toggleDesktopIcon) {
        if (currentlyCollapsed) {
          toggleDesktopIcon.classList.remove('fa-angles-left');
          toggleDesktopIcon.classList.add('fa-angles-right');
        } else {
          toggleDesktopIcon.classList.remove('fa-angles-right');
          toggleDesktopIcon.classList.add('fa-angles-left');
        }
      }
    });
  }

  // --- Mobile Drawer Open / Close ---
  function openMobileSidebar() {
    if (!mobileDrawer || !mobilePanel || !mobileBackdrop) return;
    mobileDrawer.classList.remove('hidden');
    // Force browser reflow for animation
    void mobileDrawer.offsetWidth;
    mobileBackdrop.classList.remove('opacity-0');
    mobileBackdrop.classList.add('opacity-100');
    mobilePanel.classList.remove('-translate-x-full');
    mobilePanel.classList.add('translate-x-0');
    document.body.classList.add('overflow-hidden');
  }

  function closeMobileSidebar() {
    if (!mobileDrawer || !mobilePanel || !mobileBackdrop) return;
    mobileBackdrop.classList.remove('opacity-100');
    mobileBackdrop.classList.add('opacity-0');
    mobilePanel.classList.remove('translate-x-0');
    mobilePanel.classList.add('-translate-x-full');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      mobileDrawer.classList.add('hidden');
    }, 300);
  }

  if (openMobileBtn) {
    openMobileBtn.addEventListener('click', openMobileSidebar);
  }
  if (closeMobileBtn) {
    closeMobileBtn.addEventListener('click', closeMobileSidebar);
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileSidebar);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
      closeMobileSidebar();
    }
  });

  // Close mobile sidebar when window is resized to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
      closeMobileSidebar();
    }
  });
});
