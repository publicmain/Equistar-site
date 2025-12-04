// Custom Calendar Implementation
// Author: AI Assistant
// Date: 2025

(function() {
  'use strict';

  let languageManager = null;
  let allEvents = [];
  let filteredEvents = [];

  // Event data hardcoded
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

  // Month names in different languages
  const monthNames = {
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    zh: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  };

  // Initialize calendar
  function initCalendar() {
    // Wait for language manager to be available
    if (typeof window.languageManager === 'undefined') {
      setTimeout(initCalendar, 100);
      return;
    }
    
    languageManager = window.languageManager;
    allEvents = eventData;
    filteredEvents = allEvents;
    
    renderCalendar();
    setupSearch();
    setupLanguageToggle();
  }

  // Render calendar
  function renderCalendar() {
    const container = document.getElementById('custom-calendar');
    if (!container) return;

    const locale = languageManager ? languageManager.getCurrentLanguage() : 'en';
    const months = monthNames[locale];
    const today = new Date().toISOString().slice(0, 10);

    // Group events by month
    const eventsByMonth = {};
    filteredEvents.forEach(event => {
      const month = event.Month_block;
      if (!eventsByMonth[month]) {
        eventsByMonth[month] = [];
      }
      eventsByMonth[month].push(event);
    });

    // Build HTML
    let html = '<div class="custom-calendar-grid">';

    const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    monthOrder.forEach((month, index) => {
      const events = eventsByMonth[month] || [];
      if (events.length === 0) return;

      const monthName = months[index];
      
      html += '<div class="month-section" data-month="' + month + '">';
      html += '<h3 class="month-title">' + monthName + ' 2025</h3>';
      html += '<div class="events-list">';

      events.forEach(event => {
        const isPast = event.End < today;
        const eventClass = isPast ? 'event-item past-event' : 'event-item';
        
        html += '<div class="' + eventClass + '" data-title="' + event.Title + '">';
        html += '<div class="event-date">';
        html += '<span class="event-date-range">' + formatDateRange(event.Start, event.End) + '</span>';
        html += '</div>';
        html += '<div class="event-title">' + event.Title + '</div>';
        html += '</div>';
      });

      html += '</div>'; // events-list
      html += '</div>'; // month-section
    });

    html += '</div>';

    container.innerHTML = html;
  }

  // Format date range
  function formatDateRange(start, end) {
    const locale = languageManager ? languageManager.getText('dateLocale') : 'en-US';
    const startDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T00:00:00');
    
    const monthDay = { month: 'short', day: 'numeric' };
    const fullDate = { month: 'short', day: 'numeric', year: 'numeric' };

    if (start === end) {
      return startDate.toLocaleDateString(locale, fullDate);
    }

    // Check if same month
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      return startDate.toLocaleDateString(locale, { month: 'short' }) + ' ' + 
             startDate.getDate() + '-' + endDate.getDate() + ', ' + 
             startDate.getFullYear();
    }

    return startDate.toLocaleDateString(locale, monthDay) + ' - ' + 
           endDate.toLocaleDateString(locale, fullDate);
  }

  // Search functionality
  function setupSearch() {
    const searchInput = document.getElementById('calendar-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function(e) {
      const keyword = e.target.value.trim().toLowerCase();
      
      if (keyword === '') {
        filteredEvents = allEvents;
      } else {
        filteredEvents = allEvents.filter(event => 
          event.Title.toLowerCase().includes(keyword)
        );
      }
      
      renderCalendar();
    }, 300));
  }

  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Setup language toggle
  function setupLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle && languageManager) {
      languageToggle.addEventListener('click', () => {
        languageManager.toggleLanguage();
        renderCalendar();
      });
    }
  }

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendar);
  } else {
    initCalendar();
  }
})();

