// Toggle Sidebar for mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-sidebar');

    sidebar.classList.toggle('mobile-active');

    if (sidebar.classList.contains('mobile-active')) {
        toggleBtn.innerHTML = '✕';
    } else {
        toggleBtn.innerHTML = '☰';
    }
}



    


// Chart.js configuration for daily temperature chart
const ctx = document.getElementById('temperatureChart').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 300);
gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

// Function to format labels based on screen size
function formatLabel(label, forDisplay = false) {
  const isSmallScreen = window.innerWidth <= 426;
  if (label.includes(' ')) return label;
  
  if (!isSmallScreen || forDisplay) {
    // First extract the month part and day part
    const monthChar = label.charAt(0);
    let month;
    
    switch(monthChar) {
      case 'J':
        // January, June, July
        if (label.length > 1 && label.charAt(1) === 'a') month = 'Jan';
        else if (label.length > 2 && label.substring(1,3) === 'un') month = 'Jun';
        else if (label.length > 2 && label.substring(1,3) === 'ul') month = 'Jul';
        else month = 'Jan'; // default to Jan if unclear
        break;
      case 'F':
        month = 'Feb';
        break;
      case 'M':
        // March or May
        if (label.length > 2 && label.charAt(1) === 'a' && label.charAt(2) === 'r') month = 'Mar';
        else month = 'May';
        break;
      case 'A':
        // April or August
        if (label.length > 1 && label.charAt(1) === 'p') month = 'Apr';
        else month = 'Aug';
        break;
      case 'S':
        month = 'Sep';
        break;
      case 'O':
        month = 'Oct';
        break;
      case 'N':
        month = 'Nov';
        break;
      case 'D':
        month = 'Dec';
        break;
      default:
        return label;
    }

    const day = label.replace(/\D/g, '');
    return `${month} ${day}`;
  } else {
    return label;
  }
}

// Original labels in compact format
const originalLabels = ['J02', 'J03', 'J04', 'J05', 'J06'];
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: originalLabels,
    datasets: [{
      label: 'Avg Temp (°C)',
      data: [19, 23, 21, 32, 29],
      borderColor: '#ccc',
      backgroundColor: gradient,
      borderWidth: 2,
      fill: true,
      tension: 0.,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBackgroundColor: 'lightgray',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
      pointHitRadius: 15
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuad'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: 'black',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        caretSize: 6,
        caretPadding: 6,
        titleFont: {
            family: 'Poppins',
            size: 1,       
            weight: '400'
        },
        bodyFont: {
            family: 'Poppins',
            size: 13,
            weight: '500'
        },
        callbacks: {
            title: () => '',
            label: function(context) {
              return [
                'Temperature: ' + context.formattedValue + ' °C'
              ];
            },
            afterLabel: function(context) {
              // Always show full format in tooltip
              return 'Date: ' + formatLabel(context.label, true);
            }
        },
        bodySpacing: 6,
        boxPadding: 6
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 15,
        max: 35,
        ticks: {
          color: '#666666',
          font: {
            family: 'Poppins',
            size: 12,
            weight: '500'
          },
          maxTicksLimit: 5,
          callback: function(value) {
            return value + '°C';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        }
      },
      x: {
        offset: true,
        ticks: {
          color: '#666666',
          font: {
            family: 'Poppins',
            size: 12,
            weight: '500'
          },
          callback: function(value) {
            return formatLabel(this.getLabelForValue(value));
          }
        },
        grid: {
          display: false,
          drawBorder: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
      axis: 'x'
    },
    elements: {
      point: {
        hoverRadius: 8,
        hoverBorderWidth: 2
      },
      line: {
        hoverBorderWidth: 2
      }
    },
    hover: {
      mode: 'nearest',
      intersect: false,
      animationDuration: 300
    }
  }
});
window.addEventListener('resize', function() {
  chart.update();
});







// Smooth horizontal scrolling for temperature section
document.addEventListener('DOMContentLoaded', function() {
  const scrollContainer = document.querySelector('.temp-scroll-container');
  
  // Enable smooth horizontal wheel scrolling
  scrollContainer.addEventListener('wheel', function(e) {
    e.preventDefault();
    this.scrollBy({
      left: e.deltaY * 1.5,
      behavior: 'smooth'
    });
  });

  // Optional: Add momentum to manual dragging
  let isDragging = false;
  let startX, scrollLeft;
  let velocity = 0;
  let lastTime, lastPos;
  let animationId;

  scrollContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = 'grabbing';
    cancelAnimationFrame(animationId);
  });

  const endDrag = () => {
    isDragging = false;
    scrollContainer.style.cursor = 'grab';
    applyMomentum();
  };

  scrollContainer.addEventListener('mouseleave', endDrag);
  scrollContainer.addEventListener('mouseup', endDrag);

  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainer.scrollLeft = scrollLeft - walk;
    
    // Track velocity for momentum
    const now = Date.now();
    if (lastTime) {
      velocity = (scrollContainer.scrollLeft - lastPos) / (now - lastTime);
    }
    lastTime = now;
    lastPos = scrollContainer.scrollLeft;
  });

  function applyMomentum() {
    if (Math.abs(velocity) > 0.5) {
      scrollContainer.scrollBy({
        left: velocity * 16,
        behavior: 'smooth'
      });
      velocity *= 0.92;
      animationId = requestAnimationFrame(applyMomentum);
    }
  }
});










// Popup functionality for notifications and sharing
function showPopup(title, contentType) {
  const popup = document.getElementById('popup');
  const popupTitle = document.getElementById('popup-title');
  const popupContent = document.getElementById('popup-content');

  // Prevent background scrolling
  document.body.classList.add('popup-open');

  popupTitle.textContent = title;
  popupContent.innerHTML = '';

  if (contentType === 'notifications') {
    const messages = [
      'You have 1 new weather alert.',
      'Watchlist updated successfully.'
    ];

    messages.forEach(msg => {
      const card = document.createElement('div');
      card.classList.add('notification-card');
      card.textContent = msg;
      popupContent.appendChild(card);
    });
  } 
  else if (contentType === 'share') {
    const shareContainer = document.createElement('div');
    shareContainer.classList.add('share-container');

    const linkField = document.createElement('input');
    linkField.classList.add('share-link');
    linkField.type = 'text';
    linkField.value = window.location.href;  // 🌟 Current page URL
    linkField.readOnly = true;

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.textContent = 'Copy';

    copyBtn.onclick = () => {
      navigator.clipboard.writeText(linkField.value).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
    };

    shareContainer.appendChild(linkField);
    shareContainer.appendChild(copyBtn);
    popupContent.appendChild(shareContainer);
  }

  popup.classList.remove('hidden');

  // Attach backdrop click & scroll listeners
  popup.onclick = (e) => {
    if (e.target === popup) closePopup();
  };

  window.addEventListener('scroll', closePopupOnScroll, { passive: true });
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.classList.add('hidden');
  document.body.classList.remove('popup-open');
  window.removeEventListener('scroll', closePopupOnScroll);
}

function closePopupOnScroll() {
  closePopup();
}

document.addEventListener('DOMContentLoaded', () => {
  const bell = document.querySelector('.icon-bell');
  const share = document.querySelector('.icon-share');

  if (bell) {
    bell.addEventListener('click', () => {
      showPopup('Notifications', 'notifications');
    });
  }

  if (share) {
    share.addEventListener('click', () => {
      showPopup('Share Location', 'share');
    });
  }
});