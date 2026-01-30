import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from './DarkModeContext';
import NavBar from './NavBar';
import Modal from './Modal';
import { getDashboardPath } from './ProtectedRoute';
import { getUserColor, generateUserColor, BASE_COLORS } from './colorPalette';
import { MOCK_OA_DATA, MOCK_SCHEDULE_ASSIGNMENTS, MOCK_TUTOR_COLORS } from './mockData';

export default function AssignTutors() {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [oaData, setOaData] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load state
  const [assignments, setAssignments] = useState({ mathCenter: {}, tutoringCommons: {}, writingCenter: {} });
  const [activeSection, setActiveSection] = useState('mathCenter'); // 'mathCenter', 'tutoringCommons', 'writingCenter'
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalType, setModalType] = useState("info");
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const [tutorColors, setTutorColors] = useState({}); // Custom tutor colors
  const [colorPickerOpen, setColorPickerOpen] = useState(null); // Track which tutor's color picker is open
  const [assignmentPopup, setAssignmentPopup] = useState(null); // { timeSlot, day } for multi-person assignment popup
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Track sidebar expansion
  const [showArchive, setShowArchive] = useState(false); // Track calendar archive modal
  const [archivedWeeks, setArchivedWeeks] = useState([]); // Store archived weeks
  const [hourWarnings, setHourWarnings] = useState({}); // Track tutors exceeding 19 hours
  const [showAdjustCalendar, setShowAdjustCalendar] = useState(false); // Track adjust calendar modal
  const [customTimeSlots, setCustomTimeSlots] = useState([]); // Custom time slots added by user
  const [draggedTimeSlot, setDraggedTimeSlot] = useState(null); // Currently dragged time slot
  const [dropTargetPosition, setDropTargetPosition] = useState(null); // Where to show drop indicator
  const [hasUnsavedCalendarChanges, setHasUnsavedCalendarChanges] = useState(false); // Track unsaved calendar changes
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false); // Confirmation dialog for discarding changes
  const [originalCalendarConfig, setOriginalCalendarConfig] = useState(null); // Store original config when modal opens
  
  // Default time slots that cannot be deleted (10:00 AM to 7:00 PM)
  const DEFAULT_TIME_SLOTS = [
    '10:00 – 10:30 AM', '10:30 – 11:00 AM', '11:00 – 11:30 AM', '11:30 – 12:00 PM', '12:00 – 12:30 PM',
    '12:30 – 1:00 PM', '1:00 – 1:30 PM', '1:30 – 2:00 PM', '2:00 – 2:30 PM', '2:30 – 3:00 PM',
    '3:00 – 3:30 PM', '3:30 – 4:00 PM', '4:00 – 4:30 PM', '4:30 – 5:00 PM', '5:00 – 5:30 PM',
    '5:30 – 6:00 PM', '6:00 – 6:30 PM', '6:30 – 7:00 PM'
  ];
  
  const [calendarConfig, setCalendarConfig] = useState({
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: [
      '10:00 – 10:30 AM', '10:30 – 11:00 AM', '11:00 – 11:30 AM', '11:30 – 12:00 PM', '12:00 – 12:30 PM',
      '12:30 – 1:00 PM', '1:00 – 1:30 PM', '1:30 – 2:00 PM', '2:00 – 2:30 PM', '2:30 – 3:00 PM',
      '3:00 – 3:30 PM', '3:30 – 4:00 PM', '4:00 – 4:30 PM', '4:30 – 5:00 PM', '5:00 – 5:30 PM',
      '5:30 – 6:00 PM', '6:00 – 6:30 PM', '6:30 – 7:00 PM'
    ]
  });

  // Defensive: ensure timeSlots and days always have valid arrays
  const timeSlots = Array.isArray(calendarConfig.timeSlots) && calendarConfig.timeSlots.length > 0 
    ? calendarConfig.timeSlots 
    : [
        '10:00 – 10:30 AM', '10:30 – 11:00 AM', '11:00 – 11:30 AM', '11:30 – 12:00 PM', '12:00 – 12:30 PM',
        '12:30 – 1:00 PM', '1:00 – 1:30 PM', '1:30 – 2:00 PM', '2:00 – 2:30 PM', '2:30 – 3:00 PM',
        '3:00 – 3:30 PM', '3:30 – 4:00 PM', '4:00 – 4:30 PM', '4:30 – 5:00 PM', '5:00 – 5:30 PM',
        '5:30 – 6:00 PM', '6:00 – 6:30 PM', '6:30 – 7:00 PM'
      ];
  const days = Array.isArray(calendarConfig.days) && calendarConfig.days.length > 0 
    ? calendarConfig.days 
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const sections = {
    mathCenter: 'Math Learning Center',
    tutoringCommons: 'Tutoring Commons',
    writingCenter: 'Writing Center'
  };

  // Helper function to parse time slot string into minutes since midnight
  // Returns { startMinutes, endMinutes, period } for comparison
  const parseTimeSlot = (slot) => {
    if (!slot) return null;
    
    // Extract time pattern like "8:00 – 8:30 AM" or "1:00 – 1:30 PM"
    const match = slot.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;
    
    let [, startHour, startMin, endHour, endMin, period] = match;
    startHour = parseInt(startHour);
    startMin = parseInt(startMin);
    endHour = parseInt(endHour);
    endMin = parseInt(endMin);
    period = period.toUpperCase();
    
    // Convert to 24-hour format for proper comparison
    let start24 = startHour;
    let end24 = endHour;
    
    if (period === 'PM') {
      if (startHour !== 12) start24 = startHour + 12;
      if (endHour !== 12) end24 = endHour + 12;
    } else { // AM
      if (startHour === 12) start24 = 0;
      if (endHour === 12) end24 = 0;
    }
    
    const startMinutes = start24 * 60 + startMin;
    const endMinutes = end24 * 60 + endMin;
    
    // Determine if morning (before 12 PM) or evening (after 5 PM / 17:00)
    const isMorning = period === 'AM' || (period === 'PM' && startHour === 12);
    const isEvening = period === 'PM' && start24 >= 17; // 5 PM and later
    
    return { startMinutes, endMinutes, period, isMorning: period === 'AM', isEvening };
  };

  // Validate if a time slot can be placed at a specific position
  const validateTimeSlotPlacement = (newSlot, targetPosition, currentSlots) => {
    const newParsed = parseTimeSlot(newSlot);
    if (!newParsed) {
      return { valid: false, reason: 'Invalid time format. Use format like "8:00 – 8:30 AM"' };
    }

    // Check if slots already exist to determine context
    if (currentSlots.length === 0) {
      return { valid: true };
    }

    // Get the slot before and after the target position
    const slotBefore = targetPosition > 0 ? currentSlots[targetPosition - 1] : null;
    const slotAfter = targetPosition < currentSlots.length ? currentSlots[targetPosition] : null;
    
    const beforeParsed = slotBefore ? parseTimeSlot(slotBefore) : null;
    const afterParsed = slotAfter ? parseTimeSlot(slotAfter) : null;

    // Rule 1: Check AM/PM consistency - morning slots can't go in evening area and vice versa
    if (beforeParsed && newParsed.period === 'AM' && beforeParsed.period === 'PM') {
      // Trying to place AM slot after PM slot
      return { valid: false, reason: 'Morning (AM) time slots cannot be placed after afternoon/evening (PM) slots.' };
    }
    if (afterParsed && newParsed.period === 'PM' && afterParsed.period === 'AM') {
      // Trying to place PM slot before AM slot
      return { valid: false, reason: 'Afternoon/Evening (PM) time slots cannot be placed before morning (AM) slots.' };
    }

    // Rule 2: Check chronological order - new slot must be after the slot before it
    if (beforeParsed && newParsed.startMinutes <= beforeParsed.startMinutes) {
      return { valid: false, reason: `This time slot (${newSlot}) must come after ${slotBefore} in chronological order.` };
    }

    // Rule 3: Check chronological order - new slot must be before the slot after it
    if (afterParsed && newParsed.startMinutes >= afterParsed.startMinutes) {
      return { valid: false, reason: `This time slot (${newSlot}) must come before ${slotAfter} in chronological order.` };
    }

    return { valid: true };
  };

  // Helper function to get the current week's dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate Monday of current week
    const monday = new Date(today);
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days, else go to Monday
    monday.setDate(today.getDate() + diff);
    
    // Generate array of dates for Mon-Fri
    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    
    return weekDates;
  };

  const weekDates = getWeekDates();

  // Format date for display with month name
  const formatDate = (date) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  };

  // Get current year
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Demo mode - load mock data
    const loadMockData = () => {
      // Load tutor colors
      setTutorColors(MOCK_TUTOR_COLORS);
      
      // Load OA availability data
      setOaData(MOCK_OA_DATA);
      
      // Initialize assignments object for all three sections
      const initialAssignments = {
        mathCenter: {},
        tutoringCommons: {},
        writingCenter: {}
      };
      
      ['mathCenter', 'tutoringCommons', 'writingCenter'].forEach(section => {
        timeSlots.forEach(slot => {
          initialAssignments[section][slot] = {};
          days.forEach(day => {
            initialAssignments[section][slot][day] = [];
          });
        });
      });
      
      // Load mock schedule assignments from object structure
      for (const [section, days] of Object.entries(MOCK_SCHEDULE_ASSIGNMENTS)) {
        for (const [day, slots] of Object.entries(days)) {
          for (const [timeSlot, tutors] of Object.entries(slots)) {
            if (initialAssignments[section] && 
                initialAssignments[section][timeSlot] && 
                Array.isArray(initialAssignments[section][timeSlot][day])) {
              tutors.forEach(tutorName => {
                if (!initialAssignments[section][timeSlot][day].includes(tutorName)) {
                  initialAssignments[section][timeSlot][day].push(tutorName);
                }
              });
            }
          }
        }
      }
      
      setAssignments(initialAssignments);
      setIsInitialLoad(false);
    };

    // Load calendar configuration from localStorage (admin preference)
    const savedCalendarConfig = localStorage.getItem('calendarConfig');
    if (savedCalendarConfig) {
      try {
        const parsed = JSON.parse(savedCalendarConfig);
        if (parsed && Array.isArray(parsed.timeSlots) && Array.isArray(parsed.days)) {
          setCalendarConfig(parsed);
        } else {
          console.warn('Invalid calendar config structure, using defaults');
          localStorage.removeItem('calendarConfig');
        }
      } catch (err) {
        console.error('Error loading calendar config:', err);
        localStorage.removeItem('calendarConfig');
      }
    }
    
    // Simulate loading delay
    setTimeout(loadMockData, 300);
  }, []);

  // Calculate total hours for each tutor across all sections
  const calculateTutorHours = () => {
    const tutorHours = {};
    
    Object.keys(assignments).forEach(section => {
      Object.keys(assignments[section]).forEach(timeSlot => {
        Object.keys(assignments[section][timeSlot]).forEach(day => {
          const tutorNames = assignments[section][timeSlot][day];
          if (Array.isArray(tutorNames)) {
            tutorNames.forEach(tutorName => {
              if (!tutorHours[tutorName]) {
                tutorHours[tutorName] = 0;
              }
              // Each time slot is 30 minutes = 0.5 hours
              tutorHours[tutorName] += 0.5;
            });
          }
        });
      });
    });
    
    return tutorHours;
  };

  // Check for tutors exceeding 19 hours in real-time
  useEffect(() => {
    const tutorHours = calculateTutorHours();
    const warnings = {};
    
    Object.keys(tutorHours).forEach(tutorName => {
      if (tutorHours[tutorName] > 19) {
        warnings[tutorName] = tutorHours[tutorName];
      }
    });
    
    setHourWarnings(warnings);
  }, [assignments]);

  // Get color for a tutor - use custom color if set, otherwise use default
  const getTutorColor = (tutorName) => {
    if (tutorColors[tutorName]) {
      return tutorColors[tutorName];
    }
    return getUserColor(tutorName);
  };

  // Save a custom color for a tutor (demo mode - local state only)
  const saveTutorColor = (tutorName, colorIndex) => {
    const newColor = generateUserColor(colorIndex);
    const updatedColors = { ...tutorColors, [tutorName]: newColor };
    setTutorColors(updatedColors);
    setColorPickerOpen(null);
    console.log('Demo mode: Saved tutor color locally:', tutorName, newColor);
  };

  // Color options for the picker
  const colorOptions = BASE_COLORS.map((_, index) => generateUserColor(index));

  const getAvailableOAs = (timeSlot, day) => {
    const availableOAs = oaData.filter(oa => {
      return oa.availability[timeSlot] && oa.availability[timeSlot][day];
    });
    
    // Deduplicate by tutor name
    const uniqueOAs = [];
    const seenNames = new Set();
    for (const oa of availableOAs) {
      if (!seenNames.has(oa.tutorName)) {
        seenNames.add(oa.tutorName);
        uniqueOAs.push(oa);
      }
    }
    
    // Filter out tutors already assigned to this time slot in ANY section
    const filteredOAs = uniqueOAs.filter(oa => {
      const sections = ['mathCenter', 'tutoringCommons', 'writingCenter'];
      for (const section of sections) {
        const assigned = assignments[section]?.[timeSlot]?.[day];
        if (Array.isArray(assigned) && assigned.includes(oa.tutorName)) {
          return false; // This tutor is already assigned somewhere
        }
      }
      return true;
    });
    
    return filteredOAs;
  };

  const checkConflict = (timeSlot, day, oaName, currentSection) => {
    // Check if this tutor is already assigned to the same time slot in a different section
    const sections = ['mathCenter', 'tutoringCommons', 'writingCenter'];
    for (const section of sections) {
      const assigned = assignments[section]?.[timeSlot]?.[day];
      if (section !== currentSection && Array.isArray(assigned) && assigned.includes(oaName)) {
        return section;
      }
    }
    return null;
  };

  // Helper function to save a single assignment (demo mode - local state only)
  const saveAssignmentToBackend = (tutorName, dayOfWeek, timeSlot, section) => {
    console.log(`Demo mode: Saved assignment ${tutorName} to ${section} on ${dayOfWeek} at ${timeSlot}`);
    return true;
  };

  // Helper function to delete assignments (demo mode - local state only)
  const deleteAssignmentFromBackend = (tutorName, dayOfWeek, timeSlot, section) => {
    console.log(`Demo mode: Deleted assignment ${tutorName} from ${section} on ${dayOfWeek} at ${timeSlot}`);
    return true;
  };

  const assignOA = (timeSlot, day, oaName) => {
    // Check for scheduling conflicts
    const conflict = checkConflict(timeSlot, day, oaName, activeSection);
    if (conflict) {
      const sectionNames = {
        mathCenter: 'Math Learning Center',
        tutoringCommons: 'Tutoring Commons',
        writingCenter: 'Writing Center'
      };
      setModalTitle("Scheduling Conflict");
      setModalMessage(`${oaName} is already assigned to ${sectionNames[conflict]} at ${timeSlot} on ${day}. Please choose a different tutor or remove the existing assignment.`);
      setModalType("warning");
      setModalOpen(true);
      return;
    }

    const currentAssigned = assignments[activeSection]?.[timeSlot]?.[day] || [];
    
    // Check if already assigned
    if (currentAssigned.includes(oaName)) {
      return; // Already assigned, do nothing
    }
    
    // Check if we've reached the limit of 4 people
    if (currentAssigned.length >= 4) {
      setModalTitle("Assignment Limit");
      setModalMessage("Maximum of 4 people can be assigned to the same time slot.");
      setModalType("warning");
      setModalOpen(true);
      return;
    }

    // Check if this assignment would exceed 19 hours
    const tutorHours = calculateTutorHours();
    const currentHours = tutorHours[oaName] || 0;
    const newHours = currentHours + 0.5; // Each slot is 30 minutes
    
    if (newHours > 19) {
      setModalTitle("⚠️ Hour Limit Warning");
      setModalMessage(`Warning: Assigning ${oaName} to this slot will result in ${newHours} hours, exceeding the 19-hour limit. Current hours: ${currentHours}. Do you want to proceed anyway?`);
      setModalType("warning");
      setModalOpen(true);
      // Still allow the assignment to proceed
    }

    const updatedAssignments = {
      ...assignments,
      [activeSection]: {
        ...assignments[activeSection],
        [timeSlot]: {
          ...assignments[activeSection][timeSlot],
          [day]: [...currentAssigned, oaName]
        }
      }
    };
    setAssignments(updatedAssignments);
    
    // Demo mode - just log
    saveAssignmentToBackend(oaName, day, timeSlot, activeSection);
  };

  const clearAssignment = (timeSlot, day) => {
    const currentAssigned = assignments[activeSection]?.[timeSlot]?.[day] || [];
    
    // Demo mode - just log deletions
    for (const tutorName of currentAssigned) {
      deleteAssignmentFromBackend(tutorName, day, timeSlot, activeSection);
    }
    
    const updatedAssignments = {
      ...assignments,
      [activeSection]: {
        ...assignments[activeSection],
        [timeSlot]: {
          ...assignments[activeSection][timeSlot],
          [day]: []
        }
      }
    };
    setAssignments(updatedAssignments);
  };

  const removeSpecificTutor = (timeSlot, day, tutorName) => {
    // Demo mode - just log
    deleteAssignmentFromBackend(tutorName, day, timeSlot, activeSection);
    
    const currentAssigned = assignments[activeSection]?.[timeSlot]?.[day] || [];
    const updatedAssignments = {
      ...assignments,
      [activeSection]: {
        ...assignments[activeSection],
        [timeSlot]: {
          ...assignments[activeSection][timeSlot],
          [day]: currentAssigned.filter(name => name !== tutorName)
        }
      }
    };
    setAssignments(updatedAssignments);
  };

  const handleClearAll = () => {
    // Clear all assignments for all sections
    const clearedAssignments = {
      mathCenter: {},
      tutoringCommons: {},
      writingCenter: {}
    };
    
    ['mathCenter', 'tutoringCommons', 'writingCenter'].forEach(section => {
      timeSlots.forEach(slot => {
        clearedAssignments[section][slot] = {};
        days.forEach(day => {
          clearedAssignments[section][slot][day] = [];
        });
      });
    });
    
    setAssignments(clearedAssignments);
    
    setModalTitle("Cleared");
    setModalMessage("All assignments have been cleared from the schedule.");
    setModalType("success");
    setModalOpen(true);
  };

  const archiveCurrentWeek = () => {
    const tutorHours = calculateTutorHours();
    const weekDatesForArchive = getWeekDates();
    
    const archiveEntry = {
      id: Date.now(),
      startDate: formatDate(weekDatesForArchive[0]),
      endDate: formatDate(weekDatesForArchive[4]),
      year: currentYear,
      assignments: JSON.parse(JSON.stringify(assignments)), // Deep copy
      tutorHours: tutorHours,
      timestamp: new Date().toISOString()
    };
    
    const updatedArchives = [...archivedWeeks, archiveEntry];
    setArchivedWeeks(updatedArchives);
    
    // Demo mode - just update local state
    console.log('Demo mode: Archived week locally');
    
    setModalTitle("Success");
    setModalMessage("Current week has been archived (demo mode)!");
    setModalType("success");
    setModalOpen(true);
  };

  const handleSaveAssignments = () => {
    setLoading(true);
    
    // Demo mode - just show success message
    console.log('Demo mode: Assignments saved locally');
    
    setModalTitle("Saved");
    setModalMessage("Assignments have been saved (demo mode)!");
    setModalType("success");
    setModalOpen(true);
    setLoading(false);
  };

  if (isInitialLoad || (oaData.length === 0 && isInitialLoad)) {
    return (
      <div className={isDarkMode ? 'bg-gray-900 min-h-screen' : 'bg-gradient-to-b from-blue-50 via-cyan-50 to-emerald-50 min-h-screen'}>
        <NavBar title="Assign Tutors" showBackButton={true} onBackClick={() => navigate(getDashboardPath())} />
        <div className="flex items-center justify-center min-h-[70vh]">
          <p className={`text-xl animate-pulse ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (oaData.length === 0 && !isInitialLoad) {
    return (
      <div className={isDarkMode ? 'bg-gray-900 min-h-screen' : 'bg-gradient-to-b from-blue-50 via-cyan-50 to-emerald-50 min-h-screen'}>
        <NavBar title="Assign Tutors" showBackButton={true} onBackClick={() => navigate(getDashboardPath())} />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
          <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <svg className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Tutors Available Yet
            </h2>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              There are no tutor availability schedules loaded. Please use the Availability Form from the dashboard to upload tutor schedules first.
            </p>
            <button
              onClick={() => navigate(getDashboardPath())}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Modal isOpen={modalOpen} title={modalTitle} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'bg-gray-900 min-h-screen' : 'bg-gradient-to-b from-blue-50 via-cyan-50 to-emerald-50 min-h-screen'}>
      <NavBar title="Assign Tutors/Users to Time Slots" showBackButton={true} onBackClick={() => navigate(getDashboardPath())} />

      <section className="w-full py-8 px-6">
        <div className="max-w-[1800px] mx-auto flex gap-6">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${sidebarExpanded ? 'w-80' : 'w-16'} flex-shrink-0`}>
            <div className={`sticky top-4 rounded-lg shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Sidebar Header */}
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  {sidebarExpanded && (
                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Analytics
                    </h3>
                  )}
                  <button
                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                    className={`p-2 rounded hover:bg-opacity-10 hover:bg-gray-500 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}
                    title={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                  >
                    {sidebarExpanded ? '◀' : '▶'}
                  </button>
                </div>
              </div>

              {/* Sidebar Content */}
              {sidebarExpanded && (
                <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Calendar Archive Button */}
                  <button
                    onClick={() => setShowArchive(true)}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                    }`}
                  >
                    📅 Calendar Archive
                  </button>

                  {/* Hour Warnings */}
                  {Object.keys(hourWarnings).length > 0 && (
                    <div className={`p-3 rounded-lg border-2 ${
                      isDarkMode
                        ? 'bg-orange-900/20 border-orange-700'
                        : 'bg-orange-50 border-orange-300'
                    }`}>
                      <h4 className={`font-semibold text-sm mb-2 ${
                        isDarkMode ? 'text-orange-300' : 'text-orange-700'
                      }`}>
                        ⚠️ Over 19 Hours:
                      </h4>
                      {Object.entries(hourWarnings).map(([name, hours]) => (
                        <div key={name} className={`text-xs mb-1 ${
                          isDarkMode ? 'text-orange-200' : 'text-orange-600'
                        }`}>
                          {name}: {hours}h
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tutor Hours List */}
                  <div>
                    <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tutor Hours:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(calculateTutorHours())
                        .sort((a, b) => b[1] - a[1])
                        .map(([tutorName, hours]) => {
                          const tutorColor = getTutorColor(tutorName);
                          const isWarning = hours > 19;
                          return (
                            <div
                              key={tutorName}
                              className={`p-2 rounded text-sm ${
                                isWarning ? 'ring-2 ring-orange-500' : ''
                              }`}
                              style={{
                                backgroundColor: isDarkMode ? tutorColor.dark : tutorColor.light,
                                opacity: 0.9
                              }}
                            >
                              <div className="flex justify-between items-center text-white">
                                <span className="font-medium text-xs truncate flex-1">{tutorName}</span>
                                <span className="font-bold ml-2">{hours}h</span>
                              </div>
                            </div>
                          );
                        })}
                      {Object.keys(calculateTutorHours()).length === 0 && (
                        <p className={`text-xs italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No assignments yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-slideInDown">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Assign Tutors/Users to Schedule
              </h1>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Click on a cell to assign an available Tutor/User
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/manage-tutors')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow'
                }`}
              >
                See Users
              </button>
              <button
                onClick={() => {
                  setOriginalCalendarConfig(JSON.parse(JSON.stringify(calendarConfig)));
                  setHasUnsavedCalendarChanges(false);
                  setShowAdjustCalendar(true);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                }`}
              >
                ⚙️ Adjust Calendar
              </button>
              <button
                onClick={handleClearAll}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300 shadow'
                }`}
              >
                Clear All
              </button>
              <button
                onClick={handleSaveAssignments}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 text-white hover:shadow-lg'
                }`}
              >
                {loading ? 'Saving...' : 'Save Assignments'}
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-4 mb-6 animate-slideInUp animate-stagger-1">
            {Object.keys(sections).map(sectionKey => (
              <button
                key={sectionKey}
                onClick={() => setActiveSection(sectionKey)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeSection === sectionKey
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {sections[sectionKey]}
              </button>
            ))}
          </div>

          {/* Week Display Header */}
          <div className={`mb-4 p-4 rounded-lg text-center animate-fadeIn animate-stagger-2 ${
            isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-gray-700'
          }`}>
            <span className="font-semibold text-lg">
              Week of {formatDate(weekDates[0])} - {formatDate(weekDates[4])}, {currentYear}
            </span>
          </div>

          {/* Assignment Grid */}
          <div className="overflow-x-auto rounded-lg shadow-lg animate-fadeIn animate-stagger-3">
            <div className="min-w-full">
              {/* Column Headers */}
              <div className="grid gap-0" style={{ gridTemplateColumns: '150px repeat(5, minmax(140px, 1fr))' }}>
                <div className={`p-3 font-bold text-center text-sm border ${
                  isDarkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}>
                  Time
                </div>
                {days.map((day, idx) => (
                  <div
                    key={day}
                    className={`p-3 font-bold text-center text-sm text-white border-t border-b border-r ${
                      isDarkMode ? 'bg-gray-700 border-gray-700' : 'bg-blue-600 border-gray-300'
                    }`}
                  >
                    {day}
                    <div className="text-xs mt-1 opacity-90">{formatDate(weekDates[idx])}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <div key={time} className="grid gap-0" style={{ gridTemplateColumns: '150px repeat(5, minmax(140px, 1fr))' }}>
                  <div
                    className={`p-3 text-center text-xs font-medium border-l border-r border-b h-[70px] flex items-center justify-center ${
                      isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    {time}
                  </div>
                  {days.map(day => {
                    const assignedOAs = assignments[activeSection]?.[time]?.[day] || [];
                    const availableOAs = getAvailableOAs(time, day);
                    const dropdownKey = `${time}-${day}`;
                    const isDropdownOpen = openDropdown === dropdownKey;

                    return (
                      <div key={`${time}-${day}`} className={`border-r border-b relative h-[70px] ${
                        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'
                      }`}>
                        {/* Current Assignment Box - Multi-person display */}
                        <div
                          className={`h-full flex items-center justify-center text-center font-medium text-sm cursor-pointer transition px-1 ${
                            assignedOAs.length > 0 ? 'flex-col gap-0.5 py-1' : ''
                          }`}
                          onClick={() => setAssignmentPopup({ timeSlot: time, day })}
                          style={{
                            backgroundColor: assignedOAs.length === 0
                              ? (isDarkMode ? '#2d3748' : '#f7fafc')
                              : 'transparent'
                          }}
                        >
                          {assignedOAs.length > 0 ? (
                            // Show multiple tutors with their colors
                            assignedOAs.map((tutor, idx) => {
                              const tutorColor = getTutorColor(tutor);
                              return (
                                <div
                                  key={idx}
                                  className="w-full px-1 py-0.5 rounded text-white text-xs truncate"
                                  style={{
                                    backgroundColor: isDarkMode ? tutorColor.dark : tutorColor.light
                                  }}
                                  title={tutor}
                                >
                                  {tutor}
                                </div>
                              );
                            })
                          ) : availableOAs.length > 0 ? (
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Click to assign ▼
                            </div>
                          ) : (
                            <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No tutors</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Calendar Archive Modal */}
      {showArchive && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowArchive(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  📅 Calendar Archive
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  View past week schedules and analytics
                </p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...archivedWeeks].reverse().map((archive) => (
                    <button
                      key={archive.id}
                      className={`p-6 rounded-lg border transition-all duration-300 transform hover:scale-105 text-left ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                          : 'bg-white border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">📅</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {Object.keys(archive.tutorHours).length} tutors
                        </span>
                      </div>
                      <h4 className={`font-bold text-lg mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Week of: {archive.startDate} - {archive.endDate}, {archive.year}
                      </h4>
                      <p className={`text-xs ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Total Hours: {Object.values(archive.tutorHours).reduce((sum, h) => sum + h, 0)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setShowArchive(false)}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Adjust Calendar Modal */}
      {showAdjustCalendar && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => {
              if (hasUnsavedCalendarChanges) {
                setShowDiscardConfirm(true);
              } else {
                setShowAdjustCalendar(false);
              }
            }}
          />
          <div className="fixed inset-4 md:inset-8 flex items-center justify-center z-50">
            <div className={`rounded-2xl shadow-2xl w-full h-full overflow-hidden flex flex-col ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    ⚙️ Adjust Calendar
                  </h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Drag time slots from the left panel to add them to the schedule
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (hasUnsavedCalendarChanges) {
                      setShowDiscardConfirm(true);
                    } else {
                      setShowAdjustCalendar(false);
                    }
                  }}
                  className={`p-2 rounded-lg hover:bg-opacity-20 hover:bg-gray-500 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Main Content - Split View */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Available Time Slots to Drag */}
                <div className={`w-72 flex-shrink-0 border-r overflow-y-auto ${
                  isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="p-4">
                    <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      📋 Available Time Slots
                    </h4>
                    <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Drag these to add to schedule →
                    </p>
                    
                    {/* Predefined Time Slots */}
                    <div className="space-y-2">
                      {/* Morning slots */}
                      <div className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Morning
                      </div>
                      {['8:00 – 8:30 AM', '8:30 – 9:00 AM', '9:00 – 9:30 AM', '9:30 – 10:00 AM'].map(slot => (
                        <div
                          key={slot}
                          draggable
                          onDragStart={(e) => {
                            setDraggedTimeSlot(slot);
                            e.dataTransfer.effectAllowed = 'copy';
                            e.dataTransfer.setData('text/plain', slot);
                          }}
                          onDragEnd={() => {
                            setDraggedTimeSlot(null);
                            setDropTargetPosition(null);
                          }}
                          className={`p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 border-2 border-dashed ${
                            timeSlots.includes(slot)
                              ? isDarkMode
                                ? 'bg-gray-800 text-gray-600 border-gray-700 opacity-50 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'
                              : isDarkMode
                                ? 'bg-gradient-to-r from-blue-900 to-cyan-900 text-white border-blue-700 hover:from-blue-800 hover:to-cyan-800 hover:shadow-lg'
                                : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-cyan-200 hover:shadow-md'
                          }`}
                          style={{ pointerEvents: timeSlots.includes(slot) ? 'none' : 'auto' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">⏰</span>
                            <span className="font-medium text-sm">{slot}</span>
                            {timeSlots.includes(slot) && (
                              <span className="ml-auto text-xs">(Added)</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Evening slots */}
                      <div className={`text-xs font-semibold uppercase tracking-wide mt-4 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Evening
                      </div>
                      {['7:30 – 8:00 PM', '8:00 – 8:30 PM', '8:30 – 9:00 PM', '9:00 – 9:30 PM', '9:30 – 10:00 PM'].map(slot => (
                        <div
                          key={slot}
                          draggable
                          onDragStart={(e) => {
                            setDraggedTimeSlot(slot);
                            e.dataTransfer.effectAllowed = 'copy';
                            e.dataTransfer.setData('text/plain', slot);
                          }}
                          onDragEnd={() => {
                            setDraggedTimeSlot(null);
                            setDropTargetPosition(null);
                          }}
                          className={`p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 border-2 border-dashed ${
                            timeSlots.includes(slot)
                              ? isDarkMode
                                ? 'bg-gray-800 text-gray-600 border-gray-700 opacity-50 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'
                              : isDarkMode
                                ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-white border-purple-700 hover:from-purple-800 hover:to-indigo-800 hover:shadow-lg'
                                : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-300 hover:from-purple-200 hover:to-indigo-200 hover:shadow-md'
                          }`}
                          style={{ pointerEvents: timeSlots.includes(slot) ? 'none' : 'auto' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🌙</span>
                            <span className="font-medium text-sm">{slot}</span>
                            {timeSlots.includes(slot) && (
                              <span className="ml-auto text-xs">(Added)</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Custom Time Slot Input */}
                      <div className={`text-xs font-semibold uppercase tracking-wide mt-4 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Custom
                      </div>
                      <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                        <input
                          type="text"
                          placeholder="e.g., 7:30 – 8:00 AM"
                          className={`w-full px-3 py-2 rounded text-sm ${
                            isDarkMode
                              ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500'
                              : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'
                          } border`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              const newSlot = e.target.value.trim();
                              if (!timeSlots.includes(newSlot) && !customTimeSlots.includes(newSlot)) {
                                setCustomTimeSlots([...customTimeSlots, newSlot]);
                              }
                              e.target.value = '';
                            }
                          }}
                        />
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Press Enter to add
                        </p>
                      </div>
                      
                      {/* Display custom time slots */}
                      {customTimeSlots.map(slot => (
                        <div
                          key={slot}
                          draggable
                          onDragStart={(e) => {
                            setDraggedTimeSlot(slot);
                            e.dataTransfer.effectAllowed = 'copy';
                            e.dataTransfer.setData('text/plain', slot);
                          }}
                          onDragEnd={() => {
                            setDraggedTimeSlot(null);
                            setDropTargetPosition(null);
                          }}
                          className={`p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 border-2 border-dashed ${
                            timeSlots.includes(slot)
                              ? isDarkMode
                                ? 'bg-gray-800 text-gray-600 border-gray-700 opacity-50'
                                : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50'
                              : isDarkMode
                                ? 'bg-gradient-to-r from-emerald-900 to-teal-900 text-white border-emerald-700 hover:from-emerald-800 hover:to-teal-800 hover:shadow-lg'
                                : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-300 hover:from-emerald-200 hover:to-teal-200 hover:shadow-md'
                          }`}
                          style={{ pointerEvents: timeSlots.includes(slot) ? 'none' : 'auto' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">✨</span>
                            <span className="font-medium text-sm">{slot}</span>
                            {timeSlots.includes(slot) ? (
                              <span className="ml-auto text-xs">(Added)</span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCustomTimeSlots(customTimeSlots.filter(s => s !== slot));
                                }}
                                className="ml-auto text-red-400 hover:text-red-300"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Schedule Grid */}
                <div className="flex-1 overflow-auto p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className={`font-bold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      📅 Current Schedule Grid
                    </h4>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Week of {formatDate(weekDates[0])} - {formatDate(weekDates[4])}, {currentYear}
                    </div>
                  </div>

                  {/* Schedule Grid */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                      {/* Column Headers */}
                      <div className="grid gap-0" style={{ gridTemplateColumns: '140px repeat(5, 1fr)' }}>
                        <div className={`p-3 font-bold text-center text-sm border ${
                          isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-200 text-gray-700 border-gray-300'
                        }`}>
                          Time
                        </div>
                        {days.map((day, idx) => (
                          <div
                            key={day}
                            className={`p-3 font-bold text-center text-sm border-t border-b border-r ${
                              isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-blue-600 text-white border-gray-300'
                            }`}
                          >
                            {day}
                            <div className="text-xs mt-1 opacity-80">{formatDate(weekDates[idx])}</div>
                          </div>
                        ))}
                      </div>

                      {/* Drop Zone at Top - Always visible when dragging */}
                      <div
                        className={`grid gap-0 transition-all duration-300 ${
                          draggedTimeSlot ? 'h-10 opacity-100' : 'h-0 opacity-0'
                        } ${dropTargetPosition === 'top' ? 'bg-blue-500/20' : ''}`}
                        style={{ gridTemplateColumns: '140px repeat(5, 1fr)' }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          if (draggedTimeSlot) {
                            setDropTargetPosition('top');
                          }
                        }}
                        onDragLeave={() => {
                          if (dropTargetPosition === 'top') setDropTargetPosition(null);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const slot = e.dataTransfer.getData('text/plain');
                          if (slot && !timeSlots.includes(slot)) {
                            // Validate placement at position 0 (top)
                            const validation = validateTimeSlotPlacement(slot, 0, timeSlots);
                            if (!validation.valid) {
                              setModalTitle("Invalid Placement");
                              setModalMessage(validation.reason);
                              setModalType("warning");
                              setModalOpen(true);
                            } else {
                              const newTimeSlots = [slot, ...timeSlots];
                              setCalendarConfig(prev => ({ ...prev, timeSlots: newTimeSlots }));
                              setHasUnsavedCalendarChanges(true);
                            }
                          }
                          setDraggedTimeSlot(null);
                          setDropTargetPosition(null);
                        }}
                      >
                        <div className={`border-2 border-dashed flex items-center justify-center h-full ${
                          dropTargetPosition === 'top' 
                            ? isDarkMode ? 'border-blue-500 bg-blue-900/50 animate-pulse' : 'border-blue-400 bg-blue-100 animate-pulse'
                            : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}>
                          {dropTargetPosition === 'top' && (
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                              Drop here to insert at top
                            </span>
                          )}
                        </div>
                        {days.map(day => (
                          <div
                            key={day}
                            className={`border-2 border-dashed h-full ${
                              dropTargetPosition === 'top'
                                ? isDarkMode ? 'border-blue-500 bg-blue-900/30 animate-pulse' : 'border-blue-400 bg-blue-50 animate-pulse'
                                : isDarkMode ? 'border-gray-700' : 'border-gray-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Time Slots */}
                      {timeSlots.map((time, timeIndex) => (
                        <React.Fragment key={time}>
                          <div className="grid gap-0" style={{ gridTemplateColumns: '140px repeat(5, 1fr)' }}>
                            <div
                              className={`p-3 text-center text-xs font-medium border-l border-r border-b h-12 flex items-center justify-center ${
                                isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-600' : 'bg-gray-100 text-gray-600 border-gray-300'
                              }`}
                            >
                              {time}
                              {/* Only show delete button for custom time slots (not default ones) */}
                              {!DEFAULT_TIME_SLOTS.includes(time) && (
                                <button
                                  onClick={() => {
                                    const newTimeSlots = timeSlots.filter(t => t !== time);
                                    setCalendarConfig(prev => ({ ...prev, timeSlots: newTimeSlots }));
                                    setHasUnsavedCalendarChanges(true);
                                  }}
                                  className={`ml-2 p-1 rounded hover:bg-red-500/20 ${
                                    isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600'
                                  }`}
                                  title="Remove this custom time slot"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                            {days.map(day => (
                              <div
                                key={`${time}-${day}`}
                                className={`border-r border-b h-12 ${
                                  isDarkMode ? 'border-gray-600 bg-gray-750' : 'border-gray-300 bg-gray-50'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Drop Zone after each row - Always visible when dragging */}
                          <div
                            className={`grid gap-0 transition-all duration-300 overflow-hidden ${
                              draggedTimeSlot ? 'h-10 opacity-100' : 'h-0 opacity-0'
                            } ${dropTargetPosition === `after-${timeIndex}` ? 'bg-emerald-500/20' : ''}`}
                            style={{ gridTemplateColumns: '140px repeat(5, 1fr)' }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              if (draggedTimeSlot) {
                                setDropTargetPosition(`after-${timeIndex}`);
                              }
                            }}
                            onDragLeave={(e) => {
                              // Only reset if truly leaving the drop zone
                              const rect = e.currentTarget.getBoundingClientRect();
                              if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
                                if (dropTargetPosition === `after-${timeIndex}`) {
                                  setDropTargetPosition(null);
                                }
                              }
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const slot = e.dataTransfer.getData('text/plain');
                              if (slot && !timeSlots.includes(slot)) {
                                // Validate placement at position after timeIndex
                                const validation = validateTimeSlotPlacement(slot, timeIndex + 1, timeSlots);
                                if (!validation.valid) {
                                  setModalTitle("Invalid Placement");
                                  setModalMessage(validation.reason);
                                  setModalType("warning");
                                  setModalOpen(true);
                                } else {
                                  const newTimeSlots = [...timeSlots];
                                  newTimeSlots.splice(timeIndex + 1, 0, slot);
                                  setCalendarConfig(prev => ({ ...prev, timeSlots: newTimeSlots }));
                                  setHasUnsavedCalendarChanges(true);
                                }
                              }
                              setDraggedTimeSlot(null);
                              setDropTargetPosition(null);
                            }}
                          >
                            <div className={`border-2 border-dashed flex items-center justify-center h-full ${
                              dropTargetPosition === `after-${timeIndex}` 
                                ? isDarkMode ? 'border-emerald-500 bg-emerald-900/50 animate-pulse' : 'border-emerald-400 bg-emerald-100 animate-pulse'
                                : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                            }`}>
                              {dropTargetPosition === `after-${timeIndex}` && (
                                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                                  Drop here to insert after {time}
                                </span>
                              )}
                            </div>
                            {days.map(day => (
                              <div
                                key={day}
                                className={`border-2 border-dashed h-full ${
                                  dropTargetPosition === `after-${timeIndex}`
                                    ? isDarkMode ? 'border-emerald-500 bg-emerald-900/30 animate-pulse' : 'border-emerald-400 bg-emerald-50 animate-pulse'
                                    : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Dragging Instructions */}
                  {draggedTimeSlot && (
                    <div className={`mt-4 p-4 rounded-lg text-center animate-pulse ${
                      isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <p className="font-medium">🎯 Drop "{draggedTimeSlot}" between time slots to add it to the schedule</p>
                      <p className="text-sm mt-1 opacity-75">The blinking row shows where it will be inserted</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={`p-4 border-t flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {timeSlots.length} time slots configured
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Reset to default time slots (10:00 AM to 7:00 PM)
                      const defaultSlots = [
                        '10:00 – 10:30 AM', '10:30 – 11:00 AM', '11:00 – 11:30 AM', '11:30 – 12:00 PM', '12:00 – 12:30 PM',
                        '12:30 – 1:00 PM', '1:00 – 1:30 PM', '1:30 – 2:00 PM', '2:00 – 2:30 PM', '2:30 – 3:00 PM',
                        '3:00 – 3:30 PM', '3:30 – 4:00 PM', '4:00 – 4:30 PM', '4:30 – 5:00 PM', '5:00 – 5:30 PM',
                        '5:30 – 6:00 PM', '6:00 – 6:30 PM', '6:30 – 7:00 PM'
                      ];
                      setCalendarConfig(prev => ({ ...prev, timeSlots: defaultSlots }));
                      localStorage.setItem('calendarConfig', JSON.stringify({ ...calendarConfig, timeSlots: defaultSlots }));
                      setHasUnsavedCalendarChanges(false);
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Reset to Default
                  </button>
                  {/* Save Changes Button - only if there are changes */}
                  {hasUnsavedCalendarChanges && (
                    <button
                      onClick={() => {
                        // Save to localStorage
                        localStorage.setItem('calendarConfig', JSON.stringify(calendarConfig));
                        setHasUnsavedCalendarChanges(false);
                        setOriginalCalendarConfig(JSON.parse(JSON.stringify(calendarConfig)));
                        setShowAdjustCalendar(false);
                      }}
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                      }`}
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (hasUnsavedCalendarChanges) {
                        // Show confirmation dialog before discarding
                        setShowDiscardConfirm(true);
                      } else {
                        setShowAdjustCalendar(false);
                      }
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      hasUnsavedCalendarChanges
                        ? isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : isDarkMode
                          ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                    }`}
                  >
                    {hasUnsavedCalendarChanges ? 'Discard Changes' : 'Done'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Discard Changes Confirmation Modal */}
      {showDiscardConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setShowDiscardConfirm(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[70] px-4">
            <div className={`rounded-2xl shadow-2xl max-w-md w-full p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Discard Changes?
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to discard your changes? Your custom time slots will be lost.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Keep Editing
                </button>
                <button
                  onClick={() => {
                    // Restore original config
                    if (originalCalendarConfig) {
                      setCalendarConfig(originalCalendarConfig);
                    }
                    setHasUnsavedCalendarChanges(false);
                    setShowDiscardConfirm(false);
                    setShowAdjustCalendar(false);
                  }}
                  className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Multi-Person Assignment Popup */}
      {assignmentPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setAssignmentPopup(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className={`rounded-2xl shadow-2xl max-w-lg w-full p-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Assign Tutors
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {assignmentPopup.timeSlot} on {assignmentPopup.day} ({sections[activeSection]})
              </p>

              {/* Currently Assigned */}
              <div className="mb-4">
                <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Currently Assigned ({(assignments[activeSection]?.[assignmentPopup.timeSlot]?.[assignmentPopup.day] || []).length}/4):
                </h4>
                <div className="space-y-1">
                  {(assignments[activeSection]?.[assignmentPopup.timeSlot]?.[assignmentPopup.day] || []).length === 0 ? (
                    <p className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      No one assigned yet
                    </p>
                  ) : (
                    (assignments[activeSection]?.[assignmentPopup.timeSlot]?.[assignmentPopup.day] || []).map((tutor, idx) => {
                      const tutorColor = getTutorColor(tutor);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-3 py-2 rounded"
                          style={{
                            backgroundColor: isDarkMode ? tutorColor.dark : tutorColor.light
                          }}
                        >
                          <span className="text-white font-medium">{tutor}</span>
                          <button
                            onClick={() => removeSpecificTutor(assignmentPopup.timeSlot, assignmentPopup.day, tutor)}
                            className="text-white hover:text-red-200 font-bold text-lg"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Available Tutors */}
              {(assignments[activeSection]?.[assignmentPopup.timeSlot]?.[assignmentPopup.day] || []).length < 4 && (
                <div className="mb-4">
                  <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Available Tutors:
                  </h4>
                  <div className={`max-h-48 overflow-y-auto rounded border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-300'
                  }`}>
                    {getAvailableOAs(assignmentPopup.timeSlot, assignmentPopup.day).length === 0 ? (
                      <p className={`text-sm italic p-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        No available tutors for this slot
                      </p>
                    ) : (
                      getAvailableOAs(assignmentPopup.timeSlot, assignmentPopup.day).map(oa => {
                        const tutorColor = getTutorColor(oa.tutorName);
                        return (
                          <div
                            key={oa.tutorName}
                            onClick={() => assignOA(assignmentPopup.timeSlot, assignmentPopup.day, oa.tutorName)}
                            className="px-3 py-2 cursor-pointer text-white font-medium hover:opacity-90 transition border-b last:border-b-0"
                            style={{
                              backgroundColor: isDarkMode ? tutorColor.dark : tutorColor.light,
                              borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                            }}
                          >
                            {oa.tutorName}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {(assignments[activeSection]?.[assignmentPopup.timeSlot]?.[assignmentPopup.day] || []).length > 0 && (
                  <button
                    onClick={() => {
                      clearAssignment(assignmentPopup.timeSlot, assignmentPopup.day);
                    }}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setAssignmentPopup(null)}
                  className={`flex-1 py-2 rounded-lg font-medium transition ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={modalOpen} title={modalTitle} message={modalMessage} type={modalType} onClose={() => setModalOpen(false)} />
    </div>
  );
}
