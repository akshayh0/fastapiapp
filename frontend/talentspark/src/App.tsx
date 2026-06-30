import Welcome from "./components/welcome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import { useEffect, useState } from "react";
import {getCompanies} from "./Services/companyService";
import type { company } from "./types/company";
function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [companies, setCompanies] = useState<company[]>([]);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCompanies();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
    <NavBar />
    <Welcome />
    <Footer/>
    <CompanyCard key={companies.id} 
    companies={companies}/>
    <JobCard/>
    <Footer/>
    </>
  )
}

export default App