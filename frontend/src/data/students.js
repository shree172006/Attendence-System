export const studentData = [
  // 11th Class
  { id: 1, name: 'Shantanu Sankhes Gondhali', class: '11th class', subjects: 'Maths/IT' },
  { id: 2, name: 'Dattatrey Parab', class: '11th class', subjects: 'Maths/IT' },
  { id: 3, name: 'Sahil Nilesh Mundekar', class: '11th class', subjects: 'Maths/IT' },
  { id: 4, name: 'Krishna Satish Mishra', class: '11th class', subjects: 'SP/Hindi' },
  { id: 5, name: 'Arya Tiwari', class: '11th class', subjects: 'Maths/IT' },
  { id: 6, name: 'Nikhil Khedekar', class: '11th class', subjects: 'SP/Marathi' },
  { id: 7, name: 'Shivangi Ramtirath Chaurasiya', class: '11th class', subjects: 'Maths/IT' },
  { id: 8, name: 'Rutika Mahesh Dagala', class: '11th class', subjects: 'Marathi/Maths' },
  { id: 9, name: 'Priyal Angane', class: '11th class', subjects: 'Maths/IT' },
  { id: 10, name: 'Anshika Singh', class: '11th class', subjects: 'Maths/IT' },
  { id: 11, name: 'Janhavi B J Haldankar', class: '11th class', subjects: 'SP/Marathi' },
  { id: 12, name: 'Shamika Belekar', class: '11th class', subjects: 'SP/IT' },
  { id: 13, name: 'Sunita Soud', class: '11th class', subjects: 'SP/IT' },
  
  // 12th Class
  { id: 14, name: 'Krishnakuntal Adak', class: '12th class', subjects: 'SP/IT' },
  { id: 15, name: 'Pratham Kamble', class: '12th class', subjects: 'Marathi/Maths' },
  { id: 16, name: 'Tanmay Chavan', class: '12th class', subjects: 'Marathi/Maths' },
  { id: 17, name: 'Aryan Jangam', class: '12th class', subjects: 'SP/Marathi' },
  { id: 18, name: 'Rudra Khale', class: '12th class', subjects: 'IT/Maths' },
  { id: 19, name: 'Harsh Shinde', class: '12th class', subjects: 'IT/SP' },
  { id: 20, name: 'Anurag Chaurisya', class: '12th class', subjects: 'Maths/IT' }
];

export const uniqueLectureTypes = Array.from(new Set(studentData.map(s => s.subjects)));
export const uniqueClasses = Array.from(new Set(studentData.map(s => s.class)));
