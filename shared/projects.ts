export type ProjectEntry = {
  name: string;
  nameAr: string;
  year: string;
  stack: string[];
  description: string;
  descriptionAr: string;
  projectUrl: string;
  githubUrl: string;
  galleryImages: string[];
  imageKey: string;
};

export const PROJECT_IMAGE_PLACEHOLDER = "placeholder";

export const defaultProjects: ProjectEntry[] = [
  { name: "Dona Store", nameAr: "متجر دونا", year: "2026", stack: ["React.js", "ASP.NET Core Web API", "Entity Framework Core", "SQL Server", "JWT"], description: "Full-featured e-commerce platform for electronics with a React front-end and complete ASP.NET Core REST API backend, JWT authentication, product catalog management, and end-to-end order flow with SQL Server persistence.", descriptionAr: "منصة تجارة إلكترونية متكاملة للإلكترونيات بواجهة React وواجهة خلفية كاملة باستخدام ASP.NET Core REST API، مع مصادقة JWT وإدارة كتالوج المنتجات وتدفق طلبات متكامل وحفظ البيانات في SQL Server.", projectUrl: "#", githubUrl: "#", galleryImages: [PROJECT_IMAGE_PLACEHOLDER, PROJECT_IMAGE_PLACEHOLDER, PROJECT_IMAGE_PLACEHOLDER], imageKey: "" },
  { name: "Feane Restaurant Website", nameAr: "موقع مطعم فيني", year: "2025", stack: ["HTML5", "CSS3", "JavaScript"], description: "Multi-page restaurant website with navigation menu, food offers section, online ordering flow, table booking form with validation, reviews section, and fully responsive layout.", descriptionAr: "موقع مطعم متعدد الصفحات يضم قائمة تنقل وقسم عروض الطعام وتدفق طلبات عبر الإنترنت ونموذج حجز طاولات مع التحقق من المدخلات وتصميماً متجاوباً بالكامل.", projectUrl: "#", githubUrl: "#", galleryImages: [PROJECT_IMAGE_PLACEHOLDER, PROJECT_IMAGE_PLACEHOLDER], imageKey: "" },
  { name: "Spam Detection System", nameAr: "نظام اكتشاف الرسائل المزعجة", year: "2026", stack: ["Python", "Scikit-learn", "Naive Bayes", "Logistic Regression", "TF-IDF + SVM", "Decision Tree"], description: "Spam classifier implementing five ML algorithms with both a browser-based GUI and a Jupyter Notebook version, comparing algorithm performance on real email datasets.", descriptionAr: "مصنف للرسائل المزعجة يطبّق خمس خوارزميات لتعلم الآلة، مع واجهة رسومية تعمل في المتصفح ونسخة Jupyter Notebook لمقارنة أداء الخوارزميات على مجموعات بيانات رسائل حقيقية.", projectUrl: "#", githubUrl: "#", galleryImages: [PROJECT_IMAGE_PLACEHOLDER, PROJECT_IMAGE_PLACEHOLDER, PROJECT_IMAGE_PLACEHOLDER, PROJECT_IMAGE_PLACEHOLDER], imageKey: "" },
];
