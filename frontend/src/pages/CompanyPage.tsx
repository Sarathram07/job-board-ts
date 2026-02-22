import { useParams } from "react-router";
import JobList from "../components/JobList";
import { useCompany } from "../lib/graphql/hooks/hook.js";

// -------------------- Types --------------------
// interface Job {
//   id: string | number;
//   title: string;
//   company?: {
//     name: string;
//   };
//   date: string | Date;
// }

// interface Company {
//   id: string | number;
//   name: string;
//   description: string;
//   jobs: Job[];
// }

type CompanyPageParams = {
  //companyId: string | undefined;
  [key: string]: string;
};

// -------------------- Component --------------------
function CompanyPage() {
  const { companyId } = useParams<CompanyPageParams>();

  if (!companyId) {
    console.warn("companyId param is required to fetch company");
    return;
  }

  // useCompany hook returns typed data
  const { company, loading, error } = useCompany(companyId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !company) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
