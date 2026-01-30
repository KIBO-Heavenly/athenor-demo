/**
 * Mock Data for Athenor Demo Version
 * This file contains all fake data for the demo, simulating what would normally come from a backend.
 * No real backend is needed - everything runs locally for GitHub Pages deployment.
 */

// ============================================
// DEMO CREDENTIALS
// ============================================
export const DEMO_USERS = {
  tutor: {
    email: 'demo@athenor.com',
    password: 'demo123',
    user: {
      id: 1,
      email: 'demo@athenor.com',
      fullName: 'Sarah Williams',
      role: 'Tutor',
      profilePicture: 'athenor-female-pfp',
      optOutReviews: false,
      isVerified: true
    }
  }
};

// ============================================
// FAKE REGISTERED USERS
// ============================================
export const MOCK_USERS = [
  {
    id: 1,
    email: 'demo@athenor.com',
    fullName: 'Sarah Williams',
    role: 'Tutor',
    profilePicture: 'athenor-female-pfp',
    isVerified: true,
    createdAt: '2024-09-01T14:20:00Z'
  },
  {
    id: 2,
    email: 'michael.chen@university.edu',
    fullName: 'Michael Chen',
    role: 'Tutor',
    profilePicture: 'athenor-male-pfp',
    isVerified: true,
    createdAt: '2024-09-05T09:15:00Z'
  },
  {
    id: 3,
    email: 'emma.davis@university.edu',
    fullName: 'Emma Davis',
    role: 'Tutor',
    profilePicture: 'athenor-female-pfp',
    isVerified: true,
    createdAt: '2024-09-10T11:45:00Z'
  },
  {
    id: 4,
    email: 'james.wilson@university.edu',
    fullName: 'James Wilson',
    role: 'Tutor',
    profilePicture: 'athenor-male-pfp',
    isVerified: true,
    createdAt: '2024-09-12T08:30:00Z'
  },
  {
    id: 5,
    email: 'olivia.martinez@university.edu',
    fullName: 'Olivia Martinez',
    role: 'Tutor',
    profilePicture: 'athenor-female-pfp',
    isVerified: true,
    createdAt: '2024-09-15T16:00:00Z'
  },
  {
    id: 6,
    email: 'william.brown@university.edu',
    fullName: 'William Brown',
    role: 'Tutor',
    profilePicture: 'athenor-male-pfp',
    isVerified: false,
    createdAt: '2024-10-01T13:20:00Z'
  },
  {
    id: 8,
    email: 'sophia.taylor@university.edu',
    fullName: 'Sophia Taylor',
    role: 'Tutor',
    profilePicture: 'athenor-female-pfp',
    isVerified: true,
    createdAt: '2024-10-05T10:00:00Z'
  }
];

// ============================================
// FAKE TUTOR REVIEWS
// ============================================
export const MOCK_REVIEWS = [
  {
    id: 1,
    tutorId: 2,
    tutorName: 'Sarah Williams',
    rating: 5,
    comment: 'Sarah is an excellent tutor! She explains complex calculus concepts in a way that is easy to understand. Highly recommend her for any math help.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-15T14:30:00Z'
  },
  {
    id: 2,
    tutorId: 2,
    tutorName: 'Sarah Williams',
    rating: 4,
    comment: 'Very patient and knowledgeable. Helped me improve my grades significantly.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-10T10:20:00Z'
  },
  {
    id: 3,
    tutorId: 2,
    tutorName: 'Sarah Williams',
    rating: 5,
    comment: 'Best tutor I have ever had! She goes above and beyond to make sure you understand the material.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-05T16:45:00Z'
  },
  {
    id: 4,
    tutorId: 3,
    tutorName: 'Michael Chen',
    rating: 5,
    comment: 'Michael is great at explaining programming concepts. He helped me debug my code and taught me best practices.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-12T11:00:00Z'
  },
  {
    id: 5,
    tutorId: 3,
    tutorName: 'Michael Chen',
    rating: 4,
    comment: 'Very helpful with data structures and algorithms. Clear explanations.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-08T09:30:00Z'
  },
  {
    id: 6,
    tutorId: 4,
    tutorName: 'Emma Davis',
    rating: 5,
    comment: 'Emma is fantastic at writing tutoring! My essays have improved so much since I started working with her.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-14T13:15:00Z'
  },
  {
    id: 7,
    tutorId: 1,
    tutorName: 'Alex Johnson',
    rating: 5,
    comment: 'Great admin and tutor! Very organized and always available to help.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-13T15:00:00Z'
  },
  {
    id: 8,
    tutorId: 1,
    tutorName: 'Alex Johnson',
    rating: 4,
    comment: 'Helpful and professional. Made scheduling very easy.',
    studentName: 'Anonymous Student',
    createdAt: '2024-11-01T12:00:00Z'
  }
];

// ============================================
// FAKE OFFICE ASSISTANT DATA (for Manage OAs / Assign Tutors)
// ============================================
export const MOCK_OA_DATA = [
  {
    id: 1,
    tutorName: 'Sarah Williams',
    availability: {
      'Monday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '11:00 – 11:30 AM': true, '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true },
      'Tuesday': { '1:00 – 1:30 PM': true, '1:30 – 2:00 PM': true, '2:00 – 2:30 PM': true },
      'Wednesday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '3:00 – 3:30 PM': true, '3:30 – 4:00 PM': true },
      'Thursday': { '11:00 – 11:30 AM': true, '11:30 – 12:00 PM': true, '12:00 – 12:30 PM': true },
      'Friday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '11:00 – 11:30 AM': true }
    }
  },
  {
    id: 2,
    tutorName: 'Michael Chen',
    availability: {
      'Monday': { '12:00 – 12:30 PM': true, '12:30 – 1:00 PM': true, '1:00 – 1:30 PM': true },
      'Tuesday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '4:00 – 4:30 PM': true, '4:30 – 5:00 PM': true },
      'Wednesday': { '1:00 – 1:30 PM': true, '1:30 – 2:00 PM': true, '2:00 – 2:30 PM': true },
      'Thursday': { '3:00 – 3:30 PM': true, '3:30 – 4:00 PM': true, '4:00 – 4:30 PM': true },
      'Friday': { '12:00 – 12:30 PM': true, '12:30 – 1:00 PM': true }
    }
  },
  {
    id: 3,
    tutorName: 'Emma Davis',
    availability: {
      'Monday': { '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true, '3:00 – 3:30 PM': true, '3:30 – 4:00 PM': true },
      'Tuesday': { '11:00 – 11:30 AM': true, '11:30 – 12:00 PM': true },
      'Wednesday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '11:00 – 11:30 AM': true },
      'Thursday': { '1:00 – 1:30 PM': true, '1:30 – 2:00 PM': true, '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true },
      'Friday': { '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true, '3:00 – 3:30 PM': true }
    }
  },
  {
    id: 4,
    tutorName: 'James Wilson',
    availability: {
      'Monday': { '11:00 – 11:30 AM': true, '11:30 – 12:00 PM': true },
      'Tuesday': { '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true, '3:00 – 3:30 PM': true },
      'Wednesday': { '12:00 – 12:30 PM': true, '12:30 – 1:00 PM': true, '4:00 – 4:30 PM': true, '4:30 – 5:00 PM': true },
      'Thursday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true },
      'Friday': { '1:00 – 1:30 PM': true, '1:30 – 2:00 PM': true, '2:00 – 2:30 PM': true }
    }
  },
  {
    id: 5,
    tutorName: 'Olivia Martinez',
    availability: {
      'Monday': { '3:00 – 3:30 PM': true, '3:30 – 4:00 PM': true, '4:00 – 4:30 PM': true },
      'Tuesday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '11:00 – 11:30 AM': true },
      'Wednesday': { '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true },
      'Thursday': { '12:00 – 12:30 PM': true, '12:30 – 1:00 PM': true, '1:00 – 1:30 PM': true },
      'Friday': { '10:00 – 10:30 AM': true, '10:30 – 11:00 AM': true, '4:00 – 4:30 PM': true, '4:30 – 5:00 PM': true }
    }
  },
  {
    id: 6,
    tutorName: 'Sophia Taylor',
    availability: {
      'Monday': { '1:00 – 1:30 PM': true, '1:30 – 2:00 PM': true },
      'Tuesday': { '12:00 – 12:30 PM': true, '12:30 – 1:00 PM': true, '3:00 – 3:30 PM': true, '3:30 – 4:00 PM': true },
      'Wednesday': { '11:00 – 11:30 AM': true, '11:30 – 12:00 PM': true, '5:00 – 5:30 PM': true, '5:30 – 6:00 PM': true },
      'Thursday': { '2:00 – 2:30 PM': true, '2:30 – 3:00 PM': true },
      'Friday': { '11:00 – 11:30 AM': true, '11:30 – 12:00 PM': true, '12:00 – 12:30 PM': true }
    }
  }
];

// ============================================
// FAKE SCHEDULE ASSIGNMENTS (Master Schedule)
// ============================================
export const MOCK_SCHEDULE_ASSIGNMENTS = {
  mathCenter: {
    'Monday': {
      '10:00 – 10:30 AM': ['Sarah Williams'],
      '10:30 – 11:00 AM': ['Sarah Williams'],
      '11:00 – 11:30 AM': ['Sarah Williams', 'James Wilson'],
      '11:30 – 12:00 PM': ['James Wilson'],
      '12:00 – 12:30 PM': ['Michael Chen'],
      '12:30 – 1:00 PM': ['Michael Chen'],
      '1:00 – 1:30 PM': ['Michael Chen', 'Sophia Taylor'],
      '1:30 – 2:00 PM': ['Sophia Taylor'],
      '2:00 – 2:30 PM': ['Emma Davis'],
      '2:30 – 3:00 PM': ['Emma Davis'],
      '3:00 – 3:30 PM': ['Emma Davis', 'Olivia Martinez'],
      '3:30 – 4:00 PM': ['Olivia Martinez'],
      '4:00 – 4:30 PM': ['Olivia Martinez']
    },
    'Tuesday': {
      '10:00 – 10:30 AM': ['Michael Chen', 'Olivia Martinez'],
      '10:30 – 11:00 AM': ['Michael Chen', 'Olivia Martinez'],
      '11:00 – 11:30 AM': ['Emma Davis', 'Olivia Martinez'],
      '11:30 – 12:00 PM': ['Emma Davis'],
      '12:00 – 12:30 PM': ['Sophia Taylor'],
      '12:30 – 1:00 PM': ['Sophia Taylor'],
      '1:00 – 1:30 PM': ['Sarah Williams'],
      '1:30 – 2:00 PM': ['Sarah Williams'],
      '2:00 – 2:30 PM': ['Sarah Williams', 'James Wilson'],
      '2:30 – 3:00 PM': ['James Wilson'],
      '3:00 – 3:30 PM': ['James Wilson', 'Sophia Taylor'],
      '3:30 – 4:00 PM': ['Sophia Taylor'],
      '4:00 – 4:30 PM': ['Michael Chen'],
      '4:30 – 5:00 PM': ['Michael Chen']
    },
    'Wednesday': {
      '10:00 – 10:30 AM': ['Sarah Williams', 'Emma Davis'],
      '10:30 – 11:00 AM': ['Sarah Williams', 'Emma Davis'],
      '11:00 – 11:30 AM': ['Emma Davis', 'Sophia Taylor'],
      '11:30 – 12:00 PM': ['Sophia Taylor'],
      '12:00 – 12:30 PM': ['James Wilson'],
      '12:30 – 1:00 PM': ['James Wilson'],
      '1:00 – 1:30 PM': ['Michael Chen'],
      '1:30 – 2:00 PM': ['Michael Chen'],
      '2:00 – 2:30 PM': ['Michael Chen', 'Olivia Martinez'],
      '2:30 – 3:00 PM': ['Olivia Martinez'],
      '3:00 – 3:30 PM': ['Sarah Williams'],
      '3:30 – 4:00 PM': ['Sarah Williams'],
      '4:00 – 4:30 PM': ['James Wilson'],
      '4:30 – 5:00 PM': ['James Wilson'],
      '5:00 – 5:30 PM': ['Sophia Taylor'],
      '5:30 – 6:00 PM': ['Sophia Taylor']
    },
    'Thursday': {
      '10:00 – 10:30 AM': ['James Wilson'],
      '10:30 – 11:00 AM': ['James Wilson'],
      '11:00 – 11:30 AM': ['Sarah Williams'],
      '11:30 – 12:00 PM': ['Sarah Williams'],
      '12:00 – 12:30 PM': ['Sarah Williams', 'Olivia Martinez'],
      '12:30 – 1:00 PM': ['Olivia Martinez'],
      '1:00 – 1:30 PM': ['Emma Davis', 'Olivia Martinez'],
      '1:30 – 2:00 PM': ['Emma Davis'],
      '2:00 – 2:30 PM': ['Emma Davis', 'Sophia Taylor'],
      '2:30 – 3:00 PM': ['Emma Davis', 'Sophia Taylor'],
      '3:00 – 3:30 PM': ['Michael Chen'],
      '3:30 – 4:00 PM': ['Michael Chen'],
      '4:00 – 4:30 PM': ['Michael Chen']
    },
    'Friday': {
      '10:00 – 10:30 AM': ['Sarah Williams', 'Olivia Martinez'],
      '10:30 – 11:00 AM': ['Sarah Williams', 'Olivia Martinez'],
      '11:00 – 11:30 AM': ['Sarah Williams', 'Sophia Taylor'],
      '11:30 – 12:00 PM': ['Sophia Taylor'],
      '12:00 – 12:30 PM': ['Michael Chen', 'Sophia Taylor'],
      '12:30 – 1:00 PM': ['Michael Chen'],
      '1:00 – 1:30 PM': ['James Wilson'],
      '1:30 – 2:00 PM': ['James Wilson'],
      '2:00 – 2:30 PM': ['James Wilson', 'Emma Davis'],
      '2:30 – 3:00 PM': ['Emma Davis'],
      '3:00 – 3:30 PM': ['Emma Davis'],
      '4:00 – 4:30 PM': ['Olivia Martinez'],
      '4:30 – 5:00 PM': ['Olivia Martinez']
    }
  },
  tutoringCommons: {
    'Monday': {
      '10:00 – 10:30 AM': ['Michael Chen'],
      '11:00 – 11:30 AM': ['Emma Davis'],
      '1:00 – 1:30 PM': ['Sarah Williams'],
      '3:00 – 3:30 PM': ['James Wilson']
    },
    'Tuesday': {
      '10:00 – 10:30 AM': ['Sarah Williams'],
      '12:00 – 12:30 PM': ['Michael Chen'],
      '2:00 – 2:30 PM': ['Olivia Martinez'],
      '4:00 – 4:30 PM': ['Sophia Taylor']
    },
    'Wednesday': {
      '11:00 – 11:30 AM': ['James Wilson'],
      '1:00 – 1:30 PM': ['Emma Davis'],
      '3:00 – 3:30 PM': ['Michael Chen']
    },
    'Thursday': {
      '10:00 – 10:30 AM': ['Sophia Taylor'],
      '12:00 – 12:30 PM': ['Sarah Williams'],
      '2:00 – 2:30 PM': ['James Wilson'],
      '4:00 – 4:30 PM': ['Olivia Martinez']
    },
    'Friday': {
      '10:00 – 10:30 AM': ['Emma Davis'],
      '1:00 – 1:30 PM': ['Michael Chen'],
      '3:00 – 3:30 PM': ['Sarah Williams']
    }
  },
  writingCenter: {
    'Monday': {
      '10:00 – 10:30 AM': ['Emma Davis'],
      '2:00 – 2:30 PM': ['Sophia Taylor']
    },
    'Tuesday': {
      '11:00 – 11:30 AM': ['Emma Davis'],
      '3:00 – 3:30 PM': ['Sophia Taylor']
    },
    'Wednesday': {
      '10:00 – 10:30 AM': ['Emma Davis'],
      '2:00 – 2:30 PM': ['Sophia Taylor']
    },
    'Thursday': {
      '1:00 – 1:30 PM': ['Emma Davis'],
      '3:00 – 3:30 PM': ['Sophia Taylor']
    },
    'Friday': {
      '11:00 – 11:30 AM': ['Emma Davis'],
      '2:00 – 2:30 PM': ['Sophia Taylor']
    }
  }
};

// ============================================
// FAKE IMPORTED DATA (for the Import Data button)
// ============================================
export const MOCK_IMPORTED_DATA = {
  headers: ['Student Name', 'Student ID', 'Course', 'Grade', 'Instructor', 'Semester'],
  data: [
    { 'Student Name': 'John Smith', 'Student ID': 'A00123456', 'Course': 'MATH 1314', 'Grade': 'A', 'Instructor': 'Dr. Johnson', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Maria Garcia', 'Student ID': 'A00234567', 'Course': 'MATH 1314', 'Grade': 'B', 'Instructor': 'Dr. Johnson', 'Semester': 'Fall 2024' },
    { 'Student Name': 'David Lee', 'Student ID': 'A00345678', 'Course': 'MATH 1314', 'Grade': 'A', 'Instructor': 'Dr. Johnson', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Emily Brown', 'Student ID': 'A00456789', 'Course': 'MATH 2413', 'Grade': 'B', 'Instructor': 'Dr. Smith', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Michael Wilson', 'Student ID': 'A00567890', 'Course': 'MATH 2413', 'Grade': 'A', 'Instructor': 'Dr. Smith', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Jessica Martinez', 'Student ID': 'A00678901', 'Course': 'MATH 2413', 'Grade': 'C', 'Instructor': 'Dr. Smith', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Christopher Davis', 'Student ID': 'A00789012', 'Course': 'MATH 1325', 'Grade': 'B', 'Instructor': 'Dr. Williams', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Ashley Anderson', 'Student ID': 'A00890123', 'Course': 'MATH 1325', 'Grade': 'A', 'Instructor': 'Dr. Williams', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Matthew Thomas', 'Student ID': 'A00901234', 'Course': 'MATH 1325', 'Grade': 'B', 'Instructor': 'Dr. Williams', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Jennifer Taylor', 'Student ID': 'A00012345', 'Course': 'ENGL 1301', 'Grade': 'A', 'Instructor': 'Dr. Miller', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Daniel Moore', 'Student ID': 'A00112346', 'Course': 'ENGL 1301', 'Grade': 'B', 'Instructor': 'Dr. Miller', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Amanda Jackson', 'Student ID': 'A00212347', 'Course': 'ENGL 1301', 'Grade': 'A', 'Instructor': 'Dr. Miller', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Joshua White', 'Student ID': 'A00312348', 'Course': 'PHYS 1401', 'Grade': 'C', 'Instructor': 'Dr. Harris', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Stephanie Harris', 'Student ID': 'A00412349', 'Course': 'PHYS 1401', 'Grade': 'B', 'Instructor': 'Dr. Harris', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Andrew Martin', 'Student ID': 'A00512350', 'Course': 'PHYS 1401', 'Grade': 'A', 'Instructor': 'Dr. Harris', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Nicole Thompson', 'Student ID': 'A00612351', 'Course': 'CHEM 1311', 'Grade': 'B', 'Instructor': 'Dr. Garcia', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Ryan Garcia', 'Student ID': 'A00712352', 'Course': 'CHEM 1311', 'Grade': 'A', 'Instructor': 'Dr. Garcia', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Lauren Martinez', 'Student ID': 'A00812353', 'Course': 'CHEM 1311', 'Grade': 'B', 'Instructor': 'Dr. Garcia', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Kevin Robinson', 'Student ID': 'A00912354', 'Course': 'COSC 1436', 'Grade': 'A', 'Instructor': 'Dr. Clark', 'Semester': 'Fall 2024' },
    { 'Student Name': 'Rachel Clark', 'Student ID': 'A01012355', 'Course': 'COSC 1436', 'Grade': 'A', 'Instructor': 'Dr. Clark', 'Semester': 'Fall 2024' }
  ],
  totalRows: 20
};

// ============================================
// TUTOR COLORS (for color-coding in schedules)
// ============================================
export const MOCK_TUTOR_COLORS = {
  'Sarah Williams': { light: '#3b82f6', dark: '#60a5fa' },    // Blue
  'Michael Chen': { light: '#22c55e', dark: '#4ade80' },      // Green
  'Emma Davis': { light: '#a855f7', dark: '#c084fc' },        // Purple
  'James Wilson': { light: '#f97316', dark: '#fb923c' },      // Orange
  'Olivia Martinez': { light: '#ec4899', dark: '#f472b6' },   // Pink
  'Sophia Taylor': { light: '#14b8a6', dark: '#2dd4bf' }      // Teal
};

// ============================================
// USER STATS (for Manage Users page)
// ============================================
export const MOCK_USER_STATS = {
  total: MOCK_USERS.length,
  tutors: MOCK_USERS.filter(u => u.role === 'Tutor').length,
  admins: MOCK_USERS.filter(u => u.role === 'Admin').length,
  verified: MOCK_USERS.filter(u => u.isVerified).length,
  unverified: MOCK_USERS.filter(u => !u.isVerified).length
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get reviews for a specific tutor
 */
export const getReviewsForTutor = (tutorId) => {
  const reviews = MOCK_REVIEWS.filter(r => r.tutorId === tutorId);
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
  return {
    reviews,
    averageRating: Math.round(averageRating * 10) / 10
  };
};

/**
 * Convert schedule assignments to flat array format (for compatibility with existing code)
 */
export const getScheduleAsArray = () => {
  const schedules = [];
  let id = 1;
  
  for (const [section, days] of Object.entries(MOCK_SCHEDULE_ASSIGNMENTS)) {
    for (const [day, slots] of Object.entries(days)) {
      for (const [timeSlot, tutors] of Object.entries(slots)) {
        for (const tutorName of tutors) {
          schedules.push({
            id: id++,
            section,
            dayOfWeek: day,
            timeSlot,
            tutorName
          });
        }
      }
    }
  }
  
  return schedules;
};

/**
 * Simulate login authentication
 */
export const simulateLogin = (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (normalizedEmail === DEMO_USERS.tutor.email && password === DEMO_USERS.tutor.password) {
    return { success: true, user: DEMO_USERS.tutor.user, token: 'demo-tutor-token-12345' };
  }
  
  return { success: false, error: 'Invalid email or password. Try demo@athenor.com with password: demo123' };
};

export default {
  DEMO_USERS,
  MOCK_USERS,
  MOCK_REVIEWS,
  MOCK_OA_DATA,
  MOCK_SCHEDULE_ASSIGNMENTS,
  MOCK_IMPORTED_DATA,
  MOCK_TUTOR_COLORS,
  MOCK_USER_STATS,
  getReviewsForTutor,
  getScheduleAsArray,
  simulateLogin
};
