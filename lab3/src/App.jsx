import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import JobCard from './components/JobCard'
import SearchBlock from './components/SearchBlock'
import Footer from './components/Footer'
import UserProfile from './components/UserProfile'
import ToastContainer from './components/ToastContainer'

function App() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Java Backend Developer",
      company: "SoftServe",
      city: "Львів",
      category: "IT",
      salary: 55000,
      date: "2025-02-15",
      requirements: ["Java 17", "Spring Boot", "SQL"],
      applied: false
    },
    {
      id: 2,
      title: "SMM Менеджер",
      company: "Creative Agency",
      city: "Київ",
      category: "Маркетинг",
      salary: 25000,
      date: "2025-05-10",
      requirements: ["Target Ads", "Content Plan", "Copywriting"],
      applied: false
    },
    {
      id: 3,
      title: "UI/UX Lead Designer",
      company: "DesignFlow",
      city: "Дніпро",
      category: "Дизайн",
      salary: 48000,
      date: "2025-08-22",
      requirements: ["Figma", "Design Systems", "Prototyping"],
      applied: false
    },
    {
      id: 4,
      title: "Python Data Analyst",
      company: "DataWiz",
      city: "Київ",
      category: "IT",
      salary: 42000,
      date: "2025-11-05",
      requirements: ["Pandas", "NumPy", "PowerBI"],
      applied: false
    },
    {
      id: 5,
      title: "SEO Specialist",
      company: "WebBoost",
      city: "Львів",
      category: "Маркетинг",
      salary: 28000,
      date: "2025-12-18",
      requirements: ["Google Analytics", "Ahrefs", "SEO Audit"],
      applied: false
    },
    {
      id: 6,
      title: "Graphic Designer",
      company: "BrandMasters",
      city: "Дніпро",
      category: "Дизайн",
      salary: 22000,
      date: "2026-01-12",
      requirements: ["Photoshop", "Illustrator", "Branding"],
      applied: false
    },
    {
      id: 7,
      title: "C++ Game Developer",
      company: "Ubisoft UA",
      city: "Київ",
      category: "IT",
      salary: 60000,
      date: "2026-02-01",
      requirements: ["C++", "Unreal Engine 5", "Maths"],
      applied: false
    },
    {
      id: 8,
      title: "Email Marketer",
      company: "SalesForce",
      city: "Львів",
      category: "Маркетинг",
      salary: 18000,
      date: "2026-02-28",
      requirements: ["Mailchimp", "A/B Testing", "HTML/CSS"],
      applied: false
    },
    {
      id: 9,
      title: "Motion Designer",
      company: "Animax Studio",
      city: "Дніпро",
      category: "Дизайн",
      salary: 35000,
      date: "2026-03-15",
      requirements: ["After Effects", "Cinema 4D", "Storyboarding"],
      applied: false
    },
    {
      id: 10,
      title: "Frontend React Intern",
      company: "JuniorStart",
      city: "Київ",
      category: "IT",
      salary: 12000,
      date: "2026-03-25",
      requirements: ["JavaScript", "React Basic", "Git"],
      applied: false
    }
  ]);

  const [appliedFilters, setAppliedFilters] = useState({ category: '', city: '', salary: 5000 });
  const [toasts, setToasts] = useState([]);

  const handleApply = (id, title) => {
    setJobs(prevJobs => prevJobs.map(job =>
        job.id === id ? { ...job, applied: true } : job
    ));

    const newToast = { id: Date.now(), title };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
  };

  const handleSort = () => {
    const sorted = [...jobs].sort((a, b) => new Date(b.date) - new Date(a.date));
    setJobs(sorted);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = appliedFilters.category === "" || job.category === appliedFilters.category;
    const matchesCity = appliedFilters.city === "" || job.city === appliedFilters.city;
    const matchesSalary = job.salary >= parseInt(appliedFilters.salary);
    return matchesCategory && matchesCity && matchesSalary;
  });

  return (
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <h1>Знайди роботу своєї мрії</h1>
                <hr/>
                <SearchBlock
                    filters={appliedFilters}
                    onApplyFilters={handleApplyFilters}
                    onSort={handleSort}
                />
                <h2>Актуальні вакансії</h2>
                <section className="jobs-container">
                  {filteredJobs.map(item => (
                      <JobCard key={item.id} job={item} onApply={handleApply} />
                  ))}
                </section>
              </>
            } />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer toasts={toasts} />
      </div>
  );
}

export default App;