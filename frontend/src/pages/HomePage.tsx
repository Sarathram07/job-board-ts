import { useState } from "react";
import JobList from "../components/JobList";
import PaginationBar from "../components/PaginationBar";
import { useAllJobs } from "../lib/graphql/hooks/hook.js";

// Define types for jobs (adjust fields as needed)
// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   [key: string]: any;
// }

// interface JobsData {
//   items: Job[];
//   totalCount: number;
// }

const JOBS_PER_PAGE = 5;

function HomePage(): React.ReactElement {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // lib/graphql/hooks/hook.ts
  // export function useAllJobs<T>(limit: number, offset: number): {
  //   jobs: T | null;
  //   loading: boolean;
  //   error: boolean;
  // } {
  //   // hook implementation
  // }

  // const { jobs, loading, error } = useAllJobs<JobsData>(
  //   JOBS_PER_PAGE,
  //   (currentPage - 1) * JOBS_PER_PAGE
  // );

  const { jobs, loading, error } = useAllJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE,
  );

  const totalPages: number = jobs
    ? Math.ceil(jobs.totalCount / JOBS_PER_PAGE)
    : 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>

      <JobList jobs={jobs?.items ?? []} />

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default HomePage;
