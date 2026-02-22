import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatter.ts";

// Define TypeScript types
interface Company {
  name: string;
}

interface Job {
  id: string | number;
  title: string;
  company?: Company;
  date: string; // or Date, depending on what format formatDate expects
}

interface JobListProps {
  jobs: Job[];
}

interface JobItemProps {
  job: Job;
}

function JobList({ jobs }: JobListProps) {
  return (
    <ul className="box">
      {jobs.map((job) => (
        <JobItem key={job.id} job={job} />
      ))}
    </ul>
  );
}

function JobItem({ job }: JobItemProps) {
  const title = job.company ? `${job.title} at ${job.company.name}` : job.title;
  return (
    <li className="media">
      <div className="media-left has-text-grey">{formatDate(job.date)}</div>
      <div className="media-content">
        <Link to={`/jobs/${job.id}`}>{title}</Link>
      </div>
    </li>
  );
}

export default JobList;
