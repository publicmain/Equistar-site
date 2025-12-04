// Language Data for Calendar System
// Author: AI Assistant
// Date: 2025

const LanguageData = {
  en: {
    // Calendar Page
    pageTitle: "School Calendar - Academic Year 2025",
    calendarTitle: "Academic Calendar 2025",
    calendarDescription: "View all important dates, holidays, exams, and events for the academic year 2025. Click on any event for more details.",
    searchPlaceholder: "Search events...",
    searchAriaLabel: "Search calendar events",
    downloadButton: "Download Calendar",
    downloadAriaLabel: "Download calendar as ICS file",
    languageToggle: "中文",
    languageAriaLabel: "Switch language",
    unableToLoadData: "Unable to load calendar data",
    
    // Event Details
    eventLabel: "Event",
    startLabel: "Start",
    endLabel: "End",
    
    // Homepage Widget
    upcomingEventsTitle: "Upcoming Events",
    upcomingEventsDescription: "View important upcoming school events, exams, and holiday schedules.",
    viewFullCalendar: "View Full Calendar",
    noUpcomingEvents: "No upcoming events",
    unableToLoadEvents: "Unable to load event data",
    
    // Student Life Widget
    studentActivitiesTitle: "Upcoming Student Activities",
    studentActivitiesDescription: "Join our diverse student activities including field trips, sports days, festivals, and parent meetings.",
    noStudentActivities: "No upcoming student activities",
    unableToLoadActivities: "Unable to load activity data",
    
    // Admissions Widget
    examDatesTitle: "Important Exam Dates",
    examDatesDescription: "View important upcoming dates for entry tests, preliminary examinations, GCE A-Level and IAL examinations.",
    noExamDates: "No upcoming exam dates",
    unableToLoadExams: "Unable to load exam data",
    
    // Loading states
    loading: "Loading...",
    
    // Date formatting
    dateLocale: "en-US"
  },
  
  zh: {
    // Calendar Page
    pageTitle: "学校日历 - 2025学年",
    calendarTitle: "2025学年学术日历",
    calendarDescription: "查看2025学年的所有重要日期、假期、考试和活动。点击任何活动查看详细信息。",
    searchPlaceholder: "搜索活动...",
    searchAriaLabel: "搜索日历活动",
    downloadButton: "下载日历",
    downloadAriaLabel: "下载iCalendar文件",
    languageToggle: "English",
    languageAriaLabel: "切换语言",
    unableToLoadData: "无法加载日历数据",
    
    // Event Details
    eventLabel: "活动",
    startLabel: "开始",
    endLabel: "结束",
    
    // Homepage Widget
    upcomingEventsTitle: "Upcoming Events",
    upcomingEventsDescription: "View important upcoming school events, exams, and holiday schedules.",
    viewFullCalendar: "View Full Calendar",
    noUpcomingEvents: "No upcoming events",
    unableToLoadEvents: "Unable to load event data",
    
    // Student Life Widget
    studentActivitiesTitle: "Upcoming Student Activities",
    studentActivitiesDescription: "Join our diverse student activities including field trips, sports days, festivals, and parent meetings.",
    noStudentActivities: "No upcoming student activities",
    unableToLoadActivities: "Unable to load activity data",
    
    // Admissions Widget
    examDatesTitle: "Important Exam Dates",
    examDatesDescription: "View important upcoming dates for entry tests, preliminary examinations, GCE A-Level and IAL examinations.",
    noExamDates: "No upcoming exam dates",
    unableToLoadExams: "Unable to load exam data",
    
    // Loading states
    loading: "Loading...",
    
    // Date formatting
    dateLocale: "zh-CN"
  }
};

// Language Manager
class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('calendar-language') || 'en';
    this.updatePageLanguage();
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }
  
  setLanguage(language) {
    if (LanguageData[language]) {
      this.currentLanguage = language;
      localStorage.setItem('calendar-language', language);
      this.updatePageLanguage();
    }
  }
  
  getText(key) {
    return LanguageData[this.currentLanguage][key] || LanguageData.en[key] || key;
  }
  
  updatePageLanguage() {
    // Update document title
    document.title = this.getText('pageTitle');
    
    // Update calendar page elements
    const calendarTitle = document.querySelector('h2.text-bold');
    if (calendarTitle) {
      calendarTitle.textContent = this.getText('calendarTitle');
    }
    
    const calendarDescription = document.querySelector('.text-width-medium');
    if (calendarDescription) {
      calendarDescription.textContent = this.getText('calendarDescription');
    }
    
    // Update search input
    const searchInput = document.getElementById('calendar-search');
    if (searchInput) {
      searchInput.placeholder = this.getText('searchPlaceholder');
      searchInput.setAttribute('aria-label', this.getText('searchAriaLabel'));
    }
    
    // Update download button
    const downloadBtn = document.getElementById('download-ics');
    if (downloadBtn) {
      downloadBtn.textContent = this.getText('downloadButton');
      downloadBtn.setAttribute('aria-label', this.getText('downloadAriaLabel'));
    }
    
    // Update language toggle button
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      const languageText = languageToggle.querySelector('.language-text');
      if (languageText) {
        languageText.textContent = this.getText('languageToggle');
      }
      languageToggle.setAttribute('aria-label', this.getText('languageAriaLabel'));
    }
    
    // Update FullCalendar locale
    this.updateFullCalendarLocale();
    
    // Update widget content if present
    this.updateWidgetContent();
  }
  
  updateFullCalendarLocale() {
    if (window.calendar && window.calendar.getOption) {
      window.calendar.setOption('locale', this.getText('dateLocale') === 'zh-CN' ? 'zh-cn' : 'en');
    }
  }
  
  updateWidgetContent() {
    // Update homepage widget
    const upcomingEventsContainer = document.querySelector('#upcoming-events');
    if (upcomingEventsContainer) {
      const upcomingEventsSection = upcomingEventsContainer.closest('section');
      if (upcomingEventsSection) {
        const upcomingEventsTitle = upcomingEventsSection.querySelector('h2.text-bold');
        if (upcomingEventsTitle && (upcomingEventsTitle.textContent.includes('Upcoming Events') || upcomingEventsTitle.textContent.includes('即将到来的活动'))) {
          upcomingEventsTitle.textContent = this.getText('upcomingEventsTitle');
          
          const description = upcomingEventsSection.querySelector('.text-width-medium');
          if (description) {
            description.textContent = this.getText('upcomingEventsDescription');
          }
          
          const viewBtn = upcomingEventsSection.querySelector('a[href="calendar.html"] span');
          if (viewBtn) {
            viewBtn.textContent = this.getText('viewFullCalendar');
          }
        }
      }
    }
    
    // Update student activities widget
    const studentActivitiesContainer = document.querySelector('#student-activities');
    if (studentActivitiesContainer) {
      const studentActivitiesSection = studentActivitiesContainer.closest('section');
      if (studentActivitiesSection) {
        const studentActivitiesTitle = studentActivitiesSection.querySelector('h2.text-bold');
        if (studentActivitiesTitle && (studentActivitiesTitle.textContent.includes('Student Activities') || studentActivitiesTitle.textContent.includes('学生活动'))) {
          studentActivitiesTitle.textContent = this.getText('studentActivitiesTitle');
          
          const description = studentActivitiesSection.querySelector('.text-width-medium');
          if (description) {
            description.textContent = this.getText('studentActivitiesDescription');
          }
          
          const viewBtn = studentActivitiesSection.querySelector('a[href="calendar.html"]');
          if (viewBtn) {
            viewBtn.textContent = this.getText('viewFullCalendar');
          }
        }
      }
    }
    
    // Update exam dates widget
    const examDatesContainer = document.querySelector('#exam-dates');
    if (examDatesContainer) {
      const examDatesSection = examDatesContainer.closest('section');
      if (examDatesSection) {
        const examDatesTitle = examDatesSection.querySelector('h2.text-bold');
        if (examDatesTitle && (examDatesTitle.textContent.includes('Exam Dates') || examDatesTitle.textContent.includes('考试日期'))) {
          examDatesTitle.textContent = this.getText('examDatesTitle');
          
          const description = examDatesSection.querySelector('.text-width-medium');
          if (description) {
            description.textContent = this.getText('examDatesDescription');
          }
          
          const viewBtn = examDatesSection.querySelector('a[href="calendar.html"]');
          if (viewBtn) {
            viewBtn.textContent = this.getText('viewFullCalendar');
          }
        }
      }
    }
  }
  
  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'en' ? 'zh' : 'en';
    this.setLanguage(newLanguage);
  }
}

// Initialize global language manager
window.languageManager = new LanguageManager();
