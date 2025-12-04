// School Calendar Implementation - Inline Data Version
// Author: AI Assistant
// Date: 2025

(function() {
  'use strict';

  let calendar = null;
  let allEvents = [];
  
  // Language manager reference
  let languageManager = null;
  
  // Inline event data (no need for fetch)
  const eventData = [
    {"Title":"Teacher reporting","Start":"2025-01-01","End":"2025-01-04","All_day":true,"Month_block":"January"},
    {"Title":"Student reporting","Start":"2025-01-05","End":"2025-01-11","All_day":true,"Month_block":"January"},
    {"Title":"Entry test for new students; Orientationfor new student","Start":"2025-01-12","End":"2025-01-18","All_day":true,"Month_block":"January"},
    {"Title":"Chinese New Year Holiday Week","Start":"2025-01-26","End":"2025-01-31","All_day":true,"Month_block":"January"},
    {"Title":"Learing trip: NUS Youth programme(AM)","Start":"2025-02-16","End":"2025-02-22","All_day":true,"Month_block":"February"},
    {"Title":"Monthly Test","Start":"2025-02-23","End":"2025-02-27","All_day":true,"Month_block":"February"},
    {"Title":"Learning trip: NUS Youth programme(AM)","Start":"2025-03-09","End":"2025-03-15","All_day":true,"Month_block":"March"},
    {"Title":"Monthly Test","Start":"2025-03-16","End":"2025-03-20","All_day":true,"Month_block":"March"},
    {"Title":"Swimming Day @ Yio Chu Kang Swimming Complex (8:30AM ~ 12PM)","Start":"2025-03-30","End":"2025-03-31","All_day":true,"Month_block":"March"},
    {"Title":"April Fool","Start":"2025-04-01","End":"2025-04-02","All_day":true,"Month_block":"April"},
    {"Title":"Prelim Examination & Montly Test & Good Friday","Start":"2025-04-13","End":"2025-04-19","All_day":true,"Month_block":"April"},
    {"Title":"Prelim Examination","Start":"2025-04-20","End":"2025-04-26","All_day":true,"Month_block":"April"},
    {"Title":"Prelim Examination","Start":"2025-04-27","End":"2025-04-30","All_day":true,"Month_block":"April"},
    {"Title":"Labour Day","Start":"2025-05-01","End":"2025-05-02","All_day":true,"Month_block":"May"},
    {"Title":"Prelim Examination","Start":"2025-05-11","End":"2025-05-17","All_day":true,"Month_block":"May"},
    {"Title":"Prelim Examination","Start":"2025-05-18","End":"2025-05-24","All_day":true,"Month_block":"May"},
    {"Title":"Prelim Examination","Start":"2025-05-25","End":"2025-05-31","All_day":true,"Month_block":"May"},
    {"Title":"Study Break","Start":"2025-06-01","End":"2025-06-07","All_day":true,"Month_block":"June"},
    {"Title":"Study Break","Start":"2025-06-08","End":"2025-06-14","All_day":true,"Month_block":"June"},
    {"Title":"School Reopen","Start":"2025-06-15","End":"2025-06-21","All_day":true,"Month_block":"June"},
    {"Title":"June Holiday","Start":"2025-06-22","End":"2025-06-28","All_day":true,"Month_block":"June"},
    {"Title":"June Holiday","Start":"2025-06-29","End":"2025-06-30","All_day":true,"Month_block":"June"},
    {"Title":"June Holiday","Start":"2025-07-01","End":"2025-07-05","All_day":true,"Month_block":"July"},
    {"Title":"June Holiday","Start":"2025-07-06","End":"2025-07-12","All_day":true,"Month_block":"July"},
    {"Title":"June Holiday","Start":"2025-07-13","End":"2025-07-19","All_day":true,"Month_block":"July"},
    {"Title":"June Holiday","Start":"2025-07-20","End":"2025-07-26","All_day":true,"Month_block":"July"},
    {"Title":"June Holiday","Start":"2025-07-27","End":"2025-07-31","All_day":true,"Month_block":"July"},
    {"Title":"IELTS Test","Start":"2025-08-10","End":"2025-08-16","All_day":true,"Month_block":"August"},
    {"Title":"National Day","Start":"2025-08-09","End":"2025-08-10","All_day":true,"Month_block":"August"},
    {"Title":"Sports Day @ Bishan Stadium (8:30AM ~ 12PM)","Start":"2025-08-24","End":"2025-08-30","All_day":true,"Month_block":"August"},
    {"Title":"Mid-Autumn Festival","Start":"2025-09-07","End":"2025-09-13","All_day":true,"Month_block":"September"},
    {"Title":"School Holiday","Start":"2025-09-28","End":"2025-09-30","All_day":true,"Month_block":"September"},
    {"Title":"Teachers' Day","Start":"2025-10-01","End":"2025-10-02","All_day":true,"Month_block":"October"},
    {"Title":"Edx IAL Examination","Start":"2025-10-26","End":"2025-10-30","All_day":true,"Month_block":"October"},
    {"Title":"GCE A level & Edx IAL Examination","Start":"2025-11-02","End":"2025-11-08","All_day":true,"Month_block":"November"},
    {"Title":"GCE A level & Edx IAL Examination","Start":"2025-11-09","End":"2025-11-15","All_day":true,"Month_block":"November"},
    {"Title":"GCE A level & Edx IAL Examination","Start":"2025-11-16","End":"2025-11-22","All_day":true,"Month_block":"November"},
    {"Title":"GCE A level & Edx IAL Examination","Start":"2025-11-23","End":"2025-11-29","All_day":true,"Month_block":"November"},
    {"Title":"IELTS Test; Parent Meeting","Start":"2025-12-01","End":"2025-12-06","All_day":true,"Month_block":"December"},
    {"Title":"School Holiday","Start":"2025-12-21","End":"2025-12-27","All_day":true,"Month_block":"December"},
    {"Title":"School Holiday","Start":"2025-12-28","End":"2025-12-31","All_day":true,"Month_block":"December"}
  ];
  
  // Helper: Convert inclusive end date to exclusive (FullCalendar format)
  function toExclusiveEnd(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }
  
  // Load events from inline data
  function loadEvents() {
    return eventData.map(event => ({
      title: event.Title,
      start: event.Start,
      end: toExclusiveEnd(event.End),
      allDay: true,
      extendedProps: {
        monthBlock: event.Month_block,
        originalEnd: event.End
      }
    }));
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
  function initCalendar() {
    // Wait for language manager to be available
    if (typeof window.languageManager === 'undefined') {
      setTimeout(initCalendar, 100);
      return;
    }
    
    languageManager = window.languageManager;
    
    // Load events first
    allEvents = loadEvents();
    
    if (allEvents.length === 0) {
      document.getElementById('calendar').innerHTML = 
        '<div style="text-align: center; padding: 40px; color: #999;">' +
        '<p>' + languageManager.getText('unableToLoadData') + '</p>' +
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
      locale: languageManager.getCurrentLanguage() === 'zh' ? 'zh-cn' : 'en',
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
          languageManager.getText('eventLabel') + ': ' + event.title + '\n' +
          languageManager.getText('startLabel') + ': ' + formatDate(start) + '\n' +
          languageManager.getText('endLabel') + ': ' + formatDate(new Date(end + 'T00:00:00'))
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
    const locale = languageManager ? languageManager.getText('dateLocale') : 'en-US';
    return date.toLocaleDateString(locale, options);
  }
  
  // Setup search functionality
  function setupSearch() {
    const searchInput = document.getElementById('calendar-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchEvents(e.target.value);
      });
      
      // Add aria-label
      if (languageManager) {
        searchInput.setAttribute('aria-label', languageManager.getText('searchAriaLabel'));
      }
    }
  }
  
  // Setup download button
  function setupDownload() {
    const downloadBtn = document.getElementById('download-ics');
    if (downloadBtn && languageManager) {
      downloadBtn.setAttribute('aria-label', languageManager.getText('downloadAriaLabel'));
    }
  }
  
  // Setup language toggle
  function setupLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle && languageManager) {
      languageToggle.addEventListener('click', () => {
        languageManager.toggleLanguage();
        // Reinitialize calendar with new language
        if (calendar) {
          calendar.destroy();
          initCalendar();
        }
      });
    }
  }
  
  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initCalendar();
      setupSearch();
      setupDownload();
      setupLanguageToggle();
    });
  } else {
    initCalendar();
    setupSearch();
    setupDownload();
    setupLanguageToggle();
  }
})();
