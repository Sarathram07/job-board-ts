import { useState, type SubmitEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { useCreateJob } from "../lib/graphql/hooks/hook.js";

import type {
  JobInput,
  Job as CreatedJob,
} from "../lib/graphql/dataTypes/jobType.js";

function CreateJobPage(): React.ReactElement {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { createNewJob, loading, error } = useCreateJob();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const contents: JobInput = { title, description };
    const createdJob: CreatedJob | undefined = await createNewJob(contents);
    console.log("job created:", createdJob);
    if (!createdJob) {
      console.warn("problem in creating new Job");
      return;
    }
    navigate(`/jobs/${createdJob.id}`);
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setTitle(event.target.value)
                }
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(event.target.value)
                }
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button
                type="submit"
                className="button is-link"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>

          {error && (
            <p className="help is-danger">
              {error.message || "Something went wrong"}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
