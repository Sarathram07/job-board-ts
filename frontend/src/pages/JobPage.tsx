import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatter.ts";
import { useJob } from "../lib/graphql/hooks/hook.js";

// Define types for job data
// interface Company {
//   id: string;
//   name: string;
// }

// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   company: Company;
//   [key: string]: any;
// }

type JobIdParam = {
  [key: string]: string;
};

function JobPage(): React.ReactElement {
  const { jobId } = useParams<JobIdParam>();

  // Guard: jobId could be undefined from useParams
  if (!jobId) {
    return <div className="has-text-danger">Invalid job ID</div>;
  }

  const { job, loading, error } = useJob(jobId); // If your hook supports generics
  console.log("[JobPage]", { job, loading, error });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !job) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
