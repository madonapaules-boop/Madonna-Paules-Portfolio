export const portfolio = {
  name: "Madonna Paules Bishay",
  title: "Full-Stack Developer",
  email: "madonapaules@gmail.com",
  phone: "+20 122 129 1984",
  location: "Sohag, Egypt",
  bio: "Full-stack developer with hands-on experience building web platforms and REST APIs. Proficient in C#, ASP.NET Core, React, SQL Server, and Entity Framework Core. Experienced in delivering complete end-to-end systems — from JWT-authenticated backends to responsive front-end interfaces — across a range of personal and academic projects. Currently a third-year Computer Science & Information Technology student at Egyptian E-Learning University (EELU), 2023–2027.",
  skills: [
    { category: "Languages", items: ["C#", "Java", "C++", "Python"] },
    { category: "Front-End", items: ["React.js", "HTML5", "CSS3", "JavaScript", "Bootstrap"] },
    { category: "Back-End", items: ["ASP.NET Core", "Entity Framework Core", "JWT Authentication", "REST APIs"] },
    { category: "Databases", items: ["SQL Server", "NoSQL"] },
    { category: "Tools", items: ["Git & GitHub", "Visual Studio", "Jupyter Notebook", "Shell Scripting"] },
    { category: "Machine Learning", items: ["Naive Bayes", "Logistic Regression", "TF-IDF + SVM", "Decision Tree"] },
  ],
  projects: [
    {
      name: "Dona Store",
      year: "2026",
      stack: ["React.js", "ASP.NET Core Web API", "Entity Framework Core", "SQL Server", "JWT"],
      description: "Full-featured e-commerce platform for electronics with a React front-end and complete ASP.NET Core REST API backend, JWT authentication, product catalog management, and end-to-end order flow with SQL Server persistence.",
    },
    {
      name: "Feane Restaurant Website",
      year: "2025",
      stack: ["HTML5", "CSS3", "JavaScript"],
      description: "Multi-page restaurant website with navigation menu, food offers section, online ordering flow, table booking form with validation, reviews section, and fully responsive layout.",
    },
    {
      name: "Spam Detection System",
      year: "2026",
      stack: ["Python", "Scikit-learn", "Naive Bayes", "Logistic Regression", "TF-IDF + SVM", "Decision Tree"],
      description: "Spam classifier implementing five ML algorithms with both a browser-based GUI and a Jupyter Notebook version, comparing algorithm performance on real email datasets.",
    },
  ],
  education: {
    degree: "Bachelor of CS & IT",
    university: "Egyptian E-Learning University (EELU)",
    period: "2023–2027",
    coursework: "OOP (Java, C++, C#), Data Structures, Web Development, SQL Databases, Machine Learning fundamentals.",
  },
  certifications: [
    { title: "Full-Stack Web Development", issuer: "Satr" },
    { title: "CCNA 1 & 2", issuer: "Cisco" },
    { title: "Device Configuration & Management", issuer: "IT Specialist" },
  ],
  languages: ["Arabic (Native)", "English (Intermediate B1)"],
} as const;

export const navigation = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
] as const;
