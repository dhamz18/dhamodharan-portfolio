export const profile = {
  name: 'DHAMODHARAN A',
  role: 'AI & Data Science Student',
  tagline: 'Building intelligent solutions with Data, AI & Technology.',
  bio: 'Final-year AI & Data Science student with proficiency in Java, Python, SQL, and machine learning. Skilled in data analysis, visualization, and developing practical AI solutions — eager to apply technical knowledge to real-world projects.',
  email: 'dhamodharanarumugam18@gmail.com',
  phone: '+91 9566367716',
  location: 'Erode, India',
  linkedin: 'https://www.linkedin.com/in/dhamodharan-a-992a30290',
  github: '#',
  resumeUrl: '/resume.pdf',
  profileImage: '/profile.jpg',
};

export const skills = [
  { icon: 'Code2', title: 'Programming', skills: ['Python', 'Java', 'SQL'] },
  { icon: 'Database', title: 'Data Analytics', skills: ['Excel', 'Power BI', 'Tableau'] },
  { icon: 'Brain', title: 'AI / Machine Learning', skills: ['Deep Learning', 'Model Training', 'Data Preprocessing', 'AI Solutions'] },
  { icon: 'Wrench', title: 'Tools', skills: ['Git', 'GitHub'] },
];

export const timeline: Array<{
  type: 'edu' | 'exp';
  year: string;
  title: string;
  place: string;
  meta: string;
}> = [
  {
    type: 'edu',
    year: '2022 – Present',
    title: 'B.Tech AI & Data Science',
    place: 'Velalar College of Engineering and Technology',
    meta: 'CGPA: 7.34 / 10 (Up to 6th Semester)',
  },
  {
    type: 'exp',
    year: '12/2025',
    title: 'UI/UX Intern',
    place: 'Peps Software — Erode',
    meta: 'Wireframes • Prototypes • User Research • Usability',
  },
  {
    type: 'edu',
    year: 'Completed',
    title: 'HSC',
    place: 'Shree Swami Vivekanandha Matric. Hr. Sec. School',
    meta: 'Score: 66%',
  },
];

export const projects = [
  {
    title: 'Deepfake Detection',
    date: '09/2025 – 01/2026',
    desc: 'Developed a deep learning model to detect manipulated images and videos, improving reliability of detection results through advanced preprocessing and model tuning.',
    tech: ['Deep Learning', 'Python', 'Model Training', 'Data Preprocessing'],
    image: '/projects/deepfake.jpg',
    github: '#',
    live: '#',
    disclaimer: '',
  },
  {
    title: 'AI Healthcare Chatbot',
    date: '2025',
    desc: 'Designed and implemented an AI-powered chatbot for healthcare queries with intent recognition and intelligent response generation from healthcare datasets.',
    tech: ['NLP', 'Python', 'Intent Recognition', 'Healthcare Data'],
    image: '/projects/healthbot.jpg',
    github: '#',
    live: '#',
    disclaimer: 'For informational purposes only. Not a substitute for professional medical advice.',
  },
];

export const certifications = [
  { title: 'Generative AI Workshop', issuer: 'KPR College', year: '2025' },
  { title: 'Power BI Workshop', issuer: 'Nandha College', year: '2025' },
  { title: 'Paper Presentation — Library Management System', issuer: 'SNS College', year: '2025' },
  { title: 'NPTEL — Software Engineering', issuer: 'NPTEL', year: '70%' },
  { title: 'NPTEL — Cloud Computing', issuer: 'NPTEL', year: '66%' },
];