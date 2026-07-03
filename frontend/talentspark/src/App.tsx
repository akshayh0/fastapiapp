import Welcome from "./components/welcome";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import { useEffect, useState, useCallback } from "react";
import {getCompanies} from "./Services/companyService";
import type { Company } from "./types/company";
function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const handleAddCompany = (company: Company) => {
    setCompanies((prev) => [...prev, company]);
  };

  const handleEditCompany = (company: Company) => { setCompanies((prev) => prev.map((item) => item.id === company.id ? company : item)); };

  const handleDeleteCompany = (id: number) => {
    setCompanies((prev) => prev.filter((item) => item.id !== id));
  };

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const companies = await getCompanies();
      setCompanies(companies);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompanies();
  }, [fetchCompanies]);
  if (loading) { return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <>
    <NavBar />
    <Welcome />
    <br />
    <CompanyCard
      companies={companies}
      onadd={handleAddCompany}
      onedit={handleEditCompany}
      ondelete={handleDeleteCompany}
    />
    <JobCard/>
    <Footer/>
    </>
  )
}

export default App