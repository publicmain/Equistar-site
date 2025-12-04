// School Calendar Implementation
// Author: AI Assistant
// Date: 2025

(function() {
  'use strict';

  let calendar = null;
  let allEvents = [];
  
  // Helper: Convert inclusive end date to exclusive (FullCalendar format)
  function toExclusiveEnd(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }
  
  // Load events from JSON file
  async function loadEvents() {
    try {
      const response = await fetch('data/events_2025.json');
      if (!response.ok) {
        throw new Error('Failed to load events');
      }
      const data = await response.json();
      
      return data.map(event => ({
        title: event.Title,
        start: event.Start,
        end: toExclusiveEnd(event.End),
        allDay: true,
        extendedProps: {
          monthBlock: event.Month_block,
          originalEnd: event.End
        }
      }));
    } catch (error) {
      console.error('Error loading events:', error);
      return [];
    }
  }
  
  // Debounce function for search
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Search and filter events
  const searchEvents = debounce((keyword) => {
    if (!calendar) return;
    
    const trimmed = keyword.trim().toLowerCase();
    const filtered = trimmed === '' 
      ? allEvents 
      : allEvents.filter(event => 
          event.title.toLowerCase().includes(trimmed)
        );
    
    // Remove all events and add filtered ones
    calendar.removeAllEvents();
    calendar.addEventSource(filtered);
  }, 250);
  
  // Mark past events
  function markPastEvents() {
    if (!calendar) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const events = calendar.getEvents();
    events.forEach(event => {
      const eventEnd = event.end || event.start;
      if (eventEnd < today) {
        event.setProp('classNames', ['fc-event-past']);
      }
    });
  }
  
  // Initialize calendar
  async function initCalendar() {
    // Load events first
    allEvents = await loadEvents();
    
    if (allEvents.length === 0) {
      document.getElementById('calendar').innerHTML = 
        '<div style="text-align: center; padding: 40px; color: #999;">' +
        '<p>无法加载日历数据</p>' +
        '</div>';
      return;
    }
    
    // Determine initial view based on screen width
    const initialView = window.innerWidth < 769 ? 'listMonth' : 'dayGridMonth';
    
    // Get calendar element
    const calendarEl = document.getElementById('calendar');
    
    // Initialize FullCalendar
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: initialView,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listMonth'
      },
      locale: 'zh-cn',
      timeZone: 'Asia/Singapore',
      height: 'auto',
      eventDisplay: 'block',
      displayEventTime: false,
      events: allEvents,
      
      // Event rendering
      eventDidMount: function(info) {
        // Add tooltip
        info.el.title = info.event.title;
        
        // Mark past events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventEnd = info.event.end || info.event.start;
        
        if (eventEnd < today) {
          info.el.classList.add('fc-event-past');
        }
      },
      
      // Click event
      eventClick: function(info) {
        const event = info.event;
        const start = event.start;
        const end = event.extendedProps.originalEnd || event.end;
        
        alert(
          '活动：' + event.title + '\n' +
          '开始：' + formatDate(start) + '\n' +
          '结束：' + formatDate(new Date(end + 'T00:00:00'))
        );
      },
      
      // Responsive handling
      windowResize: function(arg) {
        if (arg.view.type === 'dayGridMonth' && window.innerWidth < 769) {
          calendar.changeView('listMonth');
        } else if (arg.view.type === 'listMonth' && window.innerWidth >= 769) {
          calendar.changeView('dayGridMonth');
        }
      }
    });
    
    calendar.render();
    
    // Mark past events after rendering
    setTimeout(markPastEvents, 100);
  }
  
  // Format date for display
  function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
  }
  
  // Setup search functionality
  function setupSearch() {
    const searchInput = document.getElementById('calendar-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchEvents(e.target.value);
      });
      
      // Add aria-label
      searchInput.setAttribute('aria-label', '搜索活动');
    }
  }
  
  // Setup download button
  function setupDownload() {
    const downloadBtn = document.getElementById('download-ics');
    if (downloadBtn) {
      downloadBtn.setAttribute('aria-label', '下载 iCalendar 文件');
    }
  }
  
  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async function() {
      await initCalendar();
      setupSearch();
      setupDownload();
    });
  } else {
    (async function() {
      await initCalendar();
      setupSearch();
      setupDownload();
    })();
  }
})();

