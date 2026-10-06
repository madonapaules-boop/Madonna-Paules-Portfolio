export type SkillGroup = { category: string; categoryAr: string; items: string[] };
export type ProjectEntry = { name: string; nameAr: string; year: string; stack: string[]; description: string; descriptionAr: string; projectUrl: string; imageUrl: string; imageKey: string };
export type CertificationEntry = { title: string; titleAr: string; issuer: string };
export type LanguageEntry = { label: string; labelAr: string };

export type PortfolioContent = {
  profile: {
    name: string; nameAr: string; title: string; titleAr: string;
    bio: string; bioAr: string; availability: string; availabilityAr: string; training: string; trainingAr: string;
    email: string; phone: string; location: string; locationAr: string;
    linkedinUrl: string; githubUrl: string; instagramUrl: string; avatarUrl: string; avatarKey: string; cvUrl: string; cvKey: string;
  };
  skills: SkillGroup[];
  projects: ProjectEntry[];
  education: { degree: string; degreeAr: string; university: string; universityAr: string; period: string; coursework: string; courseworkAr: string };
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
};

export const defaultPortfolioContent: PortfolioContent = {
  profile: {
    name: "Madonna Paules Bishay", nameAr: "مادونا بولس بشاي", title: "Full-Stack Developer", titleAr: "مطور Full-Stack",
    bio: "Full-stack developer with hands-on experience building web platforms and REST APIs. Proficient in C#, ASP.NET Core, React, SQL Server, and Entity Framework Core. Experienced in delivering complete end-to-end systems — from JWT-authenticated backends to responsive front-end interfaces — across a range of personal and academic projects. Currently a third-year Computer Science & Information Technology student at Egyptian E-Learning University (EELU), 2023–2027.",
    bioAr: "مطوّرة Full-Stack تمتلك خبرة عملية في بناء منصات الويب وواجهات REST API. تتقن C# وASP.NET Core وReact وSQL Server وEntity Framework Core. لديها خبرة في تقديم أنظمة متكاملة، بدايةً من الواجهات الخلفية المؤمّنة بـ JWT وحتى الواجهات الأمامية المتجاوبة، عبر مجموعة من المشروعات الشخصية والأكاديمية. وهي حالياً طالبة في السنة الثالثة بقسم علوم الحاسب وتكنولوجيا المعلومات في الجامعة المصرية للتعلم الإلكتروني (EELU)، 2023–2027.",
    availability: "", availabilityAr: "", training: "", trainingAr: "", email: "madonapaules@gmail.com", phone: "+20 122 129 1984", location: "Sohag, Egypt", locationAr: "سوهاج، مصر", linkedinUrl: "", githubUrl: "", instagramUrl: "", avatarUrl: "", avatarKey: "", cvUrl: "", cvKey: "",
  },
  skills: [
    { category: "Languages", categoryAr: "اللغات", items: ["C#", "Java", "C++", "Python"] },
    { category: "Front-End", categoryAr: "الواجهة الأمامية", items: ["React.js", "HTML5", "CSS3", "JavaScript", "Bootstrap"] },
    { category: "Back-End", categoryAr: "الواجهة الخلفية", items: ["ASP.NET Core", "Entity Framework Core", "JWT Authentication", "REST APIs"] },
    { category: "Databases", categoryAr: "قواعد البيانات", items: ["SQL Server", "NoSQL"] },
    { category: "Tools", categoryAr: "الأدوات", items: ["Git & GitHub", "Visual Studio", "Jupyter Notebook", "Shell Scripting"] },
    { category: "Machine Learning", categoryAr: "تعلم الآلة", items: ["Naive Bayes", "Logistic Regression", "TF-IDF + SVM", "Decision Tree"] },
  ],
  projects: [
    { name: "Dona Store", nameAr: "متجر دونا", year: "2026", stack: ["React.js", "ASP.NET Core Web API", "Entity Framework Core", "SQL Server", "JWT"], description: "Full-featured e-commerce platform for electronics with a React front-end and complete ASP.NET Core REST API backend, JWT authentication, product catalog management, and end-to-end order flow with SQL Server persistence.", descriptionAr: "منصة تجارة إلكترونية متكاملة للإلكترونيات بواجهة React وواجهة خلفية كاملة باستخدام ASP.NET Core REST API، مع مصادقة JWT وإدارة كتالوج المنتجات وتدفق طلبات متكامل وحفظ البيانات في SQL Server.", projectUrl: "", imageUrl: "", imageKey: "" },
    { name: "Feane Restaurant Website", nameAr: "موقع مطعم فيني", year: "2025", stack: ["HTML5", "CSS3", "JavaScript"], description: "Multi-page restaurant website with navigation menu, food offers section, online ordering flow, table booking form with validation, reviews section, and fully responsive layout.", descriptionAr: "موقع مطعم متعدد الصفحات يضم قائمة تنقل وقسم عروض الطعام وتدفق طلبات عبر الإنترنت ونموذج حجز طاولات مع التحقق من المدخلات وتصميماً متجاوباً بالكامل.", projectUrl: "", imageUrl: "", imageKey: "" },
    { name: "Spam Detection System", nameAr: "نظام اكتشاف الرسائل المزعجة", year: "2026", stack: ["Python", "Scikit-learn", "Naive Bayes", "Logistic Regression", "TF-IDF + SVM", "Decision Tree"], description: "Spam classifier implementing five ML algorithms with both a browser-based GUI and a Jupyter Notebook version, comparing algorithm performance on real email datasets.", descriptionAr: "مصنف للرسائل المزعجة يطبّق خمس خوارزميات لتعلم الآلة، مع واجهة رسومية تعمل في المتصفح ونسخة Jupyter Notebook لمقارنة أداء الخوارزميات على مجموعات بيانات رسائل حقيقية.", projectUrl: "", imageUrl: "", imageKey: "" },
  ],
  education: { degree: "Bachelor of CS & IT", degreeAr: "بكالوريوس علوم الحاسب وتكنولوجيا المعلومات", university: "Egyptian E-Learning University (EELU)", universityAr: "الجامعة المصرية للتعلم الإلكتروني (EELU)", period: "2023–2027", coursework: "OOP (Java, C++, C#), Data Structures, Web Development, SQL Databases, Machine Learning fundamentals.", courseworkAr: "البرمجة كائنية التوجه (Java وC++ وC#)، هياكل البيانات، تطوير الويب، قواعد بيانات SQL، وأساسيات تعلم الآلة." },
  certifications: [
    { title: "Full-Stack Web Development", titleAr: "تطوير الويب Full-Stack", issuer: "Satr" },
    { title: "CCNA 1 & 2", titleAr: "CCNA 1 و2", issuer: "Cisco" },
    { title: "Device Configuration & Management", titleAr: "إعداد وإدارة الأجهزة", issuer: "IT Specialist" },
  ],
  languages: [{ label: "Arabic (Native)", labelAr: "العربية (اللغة الأم)" }, { label: "English (Intermediate B1)", labelAr: "الإنجليزية (متوسط B1)" }],
};
