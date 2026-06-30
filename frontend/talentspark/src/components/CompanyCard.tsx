import {getCompanies} from "../Services/companyService";
import { useEffect, useState } from "react";
import type { company } from "../types/company";

interface Props {
    company: company;
}

function CompanyCard({companies}: Props) {
    const [companies, setCompanies] = useState<company[]>([]);
    async function fetchCompanies() {
        const companies = await getCompanies();
        setCompanies(companies);
    }
    useEffect(() => {
        fetchCompanies();
    }, []);
    return (
        <div>
            {companies.map((company) => (
                <div key={company.id} >
                    <h1>{company.name}</h1>
                    <p>Email: {company.email}</p>
                    <p>Phone: {company.phone}</p>
                    <p>Location: {company.location}</p>
                </div>
            ))}
        </div>
    )
}

export default CompanyCard