(function() {
  // HomeFax Widget Loader
  const scriptTag = document.currentScript;
  const widgetConfig = {
    agencyId: scriptTag.getAttribute('data-agency-id') || '',
    position: scriptTag.getAttribute('data-position') || 'bottom-right'
  };

  // Create bubble button
  const bubble = document.createElement('div');
  bubble.innerHTML = `
    <button style="
      position: fixed;
      ${widgetConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: #0070f3;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  `;

  // Create iframe container
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    ${widgetConfig.position.includes('bottom') ? 'bottom: 90px;' : 'top: 90px;'}
    ${widgetConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
    width: 400px;
    height: 600px;
    max-height: calc(100vh - 120px);
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    z-index: 999999;
    display: none;
    overflow: hidden;
    background: white;
  `;

  const iframe = document.createElement('iframe');
  iframe.src = `${window.location.protocol}//${scriptTag.src.split('/')[2]}/embed/chat?agency=${widgetConfig.agencyId}`;
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  container.appendChild(iframe);

  // Toggle chat
  bubble.querySelector('button').addEventListener('click', () => {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!bubble.contains(e.target) && !container.contains(e.target)) {
      container.style.display = 'none';
    }
  });

  // Append to body when DOM is ready
  if (document.body) {
    document.body.appendChild(bubble);
    document.body.appendChild(container);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(bubble);
      document.body.appendChild(container);
    });
  }
})();
