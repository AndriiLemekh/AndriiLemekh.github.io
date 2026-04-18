import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Header from './components/Header'
import JobCard from './components/JobCard'
import SearchBlock from './components/SearchBlock'
import Footer from './components/Footer'
import UserProfile from './components/UserProfile'
import ToastContainer from './components/ToastContainer'

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { collection, getDocs, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebase';

import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollectionRef = collection(db, 'jobs');

        const snapshot = await getDocs(jobsCollectionRef);

        const jobsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setJobs(jobsList);
      } catch (error) {
        console.error("Помилка при завантаженні вакансій з бази:", error);
      }
    };

    fetchJobs();
  }, []);

  const [jobs, setJobs] = useState([]);

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  useEffect(() => {
    const fetchUserAppliedJobs = async () => {
      if (user) {
        try {
          const response = await fetch(
              `https://jobfinder-backend-y338.onrender.com/api/applications/${user.uid}`);
          if (response.ok) {
            const applied = await response.json();
            setAppliedJobIds(applied.map(j => j.id));
          }
        } catch (error) {
          console.error("Помилка завантаження заявок із сервера:", error);
        }
      } else {
        setAppliedJobIds([]);
      }
    };
    fetchUserAppliedJobs();
  }, [user]);

  const [appliedFilters, setAppliedFilters] = useState({ category: '', city: '', salary: 5000 });

  const [toasts, setToasts] = useState([]);

  const [visibleCount, setVisibleCount] = useState(6);

  const showToast = (text) => {
    const newToast = { id: Date.now(), text };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  const handleApply = async (id, title) => {
    if (!user) {
      showToast("Будь ласка, увійдіть в акаунт, щоб подати заявку.");
      return;
    }

    try {
      const response = await fetch("https://jobfinder-backend-y338.onrender.com/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user.uid,
          jobId: id,
          jobTitle: title
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAppliedJobIds(prev => [...prev, id]);
        showToast(data.message);
      } else {
        showToast(data.error);
      }
    } catch (error) {
      console.error("Помилка при поданні заявки:", error);
      showToast("Виникла помилка з'єднання з сервером.");
    }
  };

  const handleApplyFilters = (newFilters) => {
    setAppliedFilters(newFilters);
    setVisibleCount(6);
  };

  const handleSort = () => {
    const sorted = [...jobs].sort((a, b) => new Date(b.date) - new Date(a.date));
    setJobs(sorted);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = appliedFilters.category === "" || job.category === appliedFilters.category;
    const matchesCity = appliedFilters.city === "" || job.city === appliedFilters.city;
    const matchesSalary = job.salary >= parseInt(appliedFilters.salary);
    return matchesCategory && matchesCity && matchesSalary;
  });

  return (
      <div className="App">
        <Header user={user} />
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
                  {filteredJobs.slice(0, visibleCount).map(item => (
                      <JobCard
                          key={item.id}
                          job={{ ...item, applied: appliedJobIds.includes(item.id) }}
                          onApply={handleApply}
                          user={user}
                      />
                  ))}
                </section>

                {visibleCount < filteredJobs.length && (
                    <div className="load-more-container">
                      <button
                          className="load-more-btn"
                          onClick={handleLoadMore}
                      >
                        Показати ще ⬇️
                      </button>
                    </div>
                )}
              </>
            } />
            <Route path="/auth" element={
              user ? <Navigate to="/profile" /> : <Auth />
            } />

            <Route path="/profile" element={
              user ? (
                  <UserProfile
                      showToast={showToast}
                      onJobRemoved={(removedJobId) => {
                        setAppliedJobIds(prev => prev.filter(id => id !== removedJobId));
                      }}
                  />
              ) : <Navigate to="/auth" />
            } />
          </Routes>
        </main>
        <Footer />
        <ToastContainer toasts={toasts} />
      </div>
  );
}

export default App;