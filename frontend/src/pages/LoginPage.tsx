import { useState, type SubmitEvent, type ChangeEvent } from "react";
import { login } from "../lib/auth";

// Define the shape of the user object returned by login
interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

function LoginPage({ onLogin }: LoginPageProps): React.ReactElement {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(false);

    const data = { name, email, password };
    try {
      const user: User | null = await login(data);
      if (user) {
        onLogin(user);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            required
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setName(event.target.value)
            }
          />
        </div>

        <label className="label">Email</label>
        <div className="control">
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setEmail(event.target.value)
            }
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input
            className="input"
            type="password"
            required
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
          />
        </div>
      </div>

      {error && (
        <div className="message is-danger">
          <p className="message-body">Login failed</p>
        </div>
      )}

      <div className="field">
        <div className="control">
          <button type="submit" className="button is-link">
            Login
          </button>
        </div>
      </div>
    </form>
  );
}

export default LoginPage;
