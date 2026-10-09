import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  Monitor,
  Users,
  AlertTriangle,
  LogOut,
  ArrowUpRight,
  CheckCircle2,
  Activity,
  Wrench,
  Sparkles,
  LockKeyhole,
  UserRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Plus,
  X,
  ChevronDown,
  UserPlus,
  Mail,
  TriangleAlert,
  Search,
} from "lucide-react";
const API_URL = "http://localhost:5000/api";
const computerStatuses = [
  "Available",
  "In Use",
  "Maintenance",
  "Faulty",
];
function App() {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  useEffect(() => {
    const storedUser =
      localStorage.getItem("labx_user");
    const storedToken =
      localStorage.getItem("labx_token");
    if (
      storedUser &&
      storedToken
    ) {
      try {
        setUser(
          JSON.parse(storedUser)
        );
      } catch {
        localStorage.removeItem(
          "labx_user"
        );
        localStorage.removeItem(
          "labx_token"
        );
      }
    }
    setLoadingSession(false);
  }, []);
  const handleLogin = (
    loggedInUser,
    token
  ) => {
    localStorage.setItem(
      "labx_user",
      JSON.stringify(loggedInUser)
    );
    localStorage.setItem(
      "labx_token",
      token
    );
    setUser(loggedInUser);
  };
  const handleLogout = () => {
    localStorage.removeItem(
      "labx_user"
    );
    localStorage.removeItem(
      "labx_token"
    );
    setUser(null);
  };
  if (loadingSession) {
    return <LoadingScreen />;
  }
  if (!user) {
    return (
      <LoginScreen
        onLogin={handleLogin}
      />
    );
  }
  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
    />
  );
}
/* =========================================================
   LOGIN
========================================================= */
function LoginScreen({ onLogin }) {
  const [mode, setMode] =
    useState("login");
  const [username, setUsername] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [name, setName] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");
  const switchMode = (
    nextMode
  ) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
    setName("");
    setEmail("");
  };
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (mode === "login") {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };
  const handleLogin = async () => {
    if (
      !username.trim() ||
      !password
    ) {
      setError(
        "Please enter your username and password."
      );
      return;
    }
    try {
      setLoading(true);
      const response =
        await axios.post(
          `${API_URL}/auth/login`,
          {
            username:
              username.trim(),
            password,
          }
        );
      if (
        response.data.success &&
        response.data.token &&
        response.data.user
      ) {
        onLogin(
          response.data.user,
          response.data.token
        );
      } else {
        setError(
          "Unable to complete login."
        );
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
        "Unable to connect to the LabX server."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleRegister =
    async () => {
      if (
        !name.trim() ||
        !username.trim() ||
        !email.trim() ||
        !password
      ) {
        setError(
          "Please complete all registration fields."
        );
        return;
      }
      if (password.length < 6) {
        setError(
          "Password must contain at least 6 characters."
        );
        return;
      }
      try {
        setLoading(true);
        const response =
          await axios.post(
            `${API_URL}/auth/register`,
            {
              name:
                name.trim(),
              username:
                username.trim(),
              email:
                email.trim(),
              password,
            }
          );
        if (
          response.data.success
        ) {
          setSuccess(
            "Account created successfully. You can now sign in."
          );
          setMode("login");
          setUsername("");
          setPassword("");
          setName("");
          setEmail("");
        } else {
          setError(
            response.data.message ||
            "Unable to create account."
          );
        }
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
          "Unable to connect to the LabX server."
        );
      } finally {
        setLoading(false);
      }
    };
  const isLogin =
    mode === "login";
  return (
    <div className="login-page">
      <div className="login-container">
        <section className="login-brand-panel">
          <div className="login-brand">
            <div className="login-brand-mark">
              L
            </div>
            <div>
              <div className="login-brand-name">
                LABX
              </div>
              <div className="login-brand-subtitle">
                SMART LAB
              </div>
            </div>
          </div>
          <div className="login-brand-content">
            <div className="login-small-tag">
              <Sparkles size={13} />
              Smart laboratory management
            </div>
            <h1>
              Your lab,
              <br />
              <span>
                beautifully managed.
              </span>
            </h1>
            <p>
              Manage computers, students and
              laboratory issues from one simple,
              calm workspace.
            </p>
          </div>
        </section>
        <section className="login-form-panel">
          <div className="login-card">
            <div className="login-card-top">
              <div className="login-welcome-icon">
                {isLogin ? (
                  <LockKeyhole size={19} />
                ) : (
                  <UserPlus size={19} />
                )}
              </div>
              <div className="login-secure">
                <ShieldCheck size={14} />
                Secure access
              </div>
            </div>
            <div className="login-heading">
              <h2>
                Welcome
              </h2>
              <p>
                {isLogin
                  ? "Sign in to continue to your lab."
                  : "Create your LabX user account."}
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="login-form"
            >
              {!isLogin && (
                <div className="input-group">
                  <label>
                    Full name
                  </label>
                  <div className="input-wrapper">
                    <UserRound
                      size={17}
                      className="input-icon"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(
                          event.target.value
                        )
                      }
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}
              {!isLogin && (
                <div className="input-group">
                  <label>
                    Email
                  </label>
                  <div className="input-wrapper">
                    <Mail
                      size={17}
                      className="input-icon"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}
              <div className="input-group">
                <label>
                  Username
                </label>
                <div className="input-wrapper">
                  <UserRound
                    size={17}
                    className="input-icon"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(
                        event.target.value
                      )
                    }
                    placeholder="Enter your username"
                  />
                </div>
              </div>
              <div className="input-group">
                <label>
                  Password
                </label>
                <div className="input-wrapper">
                  <LockKeyhole
                    size={17}
                    className="input-icon"
                  />
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="login-error">
                  <AlertTriangle size={15} />
                  <span>
                    {error}
                  </span>
                </div>
              )}
              {success && (
                <div className="login-success">
                  <CheckCircle2 size={15} />
                  <span>
                    {success}
                  </span>
                </div>
              )}
              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    {isLogin
                      ? "Signing in..."
                      : "Creating account..."}
                  </>
                ) : (
                  <>
                    {isLogin
                      ? "Sign in"
                      : "Create account"}
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>
            </form>
            <div className="login-divider">
              <span />
              <small>
                LABX ACCESS
              </small>
              <span />
            </div>
            <div className="auth-switch">
              {isLogin ? (
                <>
                  <span>
                    New to LabX?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      switchMode(
                        "register"
                      )
                    }
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  <span>
                    Already have an account?
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      switchMode(
                        "login"
                      )
                    }
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
/* =========================================================
   DASHBOARD
========================================================= */
function Dashboard({
  user,
  onLogout,
}) {
  const isAdmin =
    user.role === "ADMIN";
  const [computers, setComputers] =
    useState([]);
  const [loadingComputers, setLoadingComputers] =
    useState(true);
  const [computerError, setComputerError] =
    useState("");

  const [students, setStudents] =
    useState(() => {
      try {
        const stored = localStorage.getItem(
          `labx_students_${user.username}`
        );

        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    });

  const [showAddStudent, setShowAddStudent] =
    useState(false);

  const [issues, setIssues] = useState(() => {
    try {
      const stored = localStorage.getItem(`labx_issues_${user.username}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueSearch, setIssueSearch] = useState("");

  const [assigningStudent, setAssigningStudent] =
    useState(null);

  const [studentSearch, setStudentSearch] =
    useState("");

  const [studentError, setStudentError] =
    useState("");

  const [showAddComputer, setShowAddComputer] =
    useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);
  const [activePage, setActivePage] =
    useState("Dashboard");
  const fetchComputers =
    async () => {
      try {
        setLoadingComputers(true);
        setComputerError("");
        const token =
          localStorage.getItem(
            "labx_token"
          );
        const response =
          await axios.get(
            `${API_URL}/computers`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );
        if (
          response.data.success
        ) {
          setComputers(
            response.data.computers
          );
        }
      } catch (error) {
        setComputerError(
          error.response?.data?.message ||
          "Unable to load computers."
        );
      } finally {
        setLoadingComputers(false);
      }
    };
  useEffect(() => {
    fetchComputers();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      `labx_students_${user.username}`,
      JSON.stringify(students)
    );
  }, [students, user.username]);

  useEffect(() => {
    localStorage.setItem(
      `labx_issues_${user.username}`,
      JSON.stringify(issues)
    );
  }, [issues, user.username]);
  const statistics =
    useMemo(() => {
      return {
        total:
          computers.length,
        available:
          computers.filter(
            (computer) =>
              computer.status ===
              "Available"
          ).length,
        inUse:
          computers.filter(
            (computer) =>
              computer.status ===
              "In Use"
          ).length,
        issues:
          computers.filter(
            (computer) =>
              computer.status ===
                "Faulty" ||
              computer.status ===
                "Maintenance"
          ).length,
      };
    }, [computers]);
  const handleAddComputer =
    async (computer) => {
      try {
        const token =
          localStorage.getItem(
            "labx_token"
          );
        const response =
          await axios.post(
            `${API_URL}/computers`,
            computer,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );
        if (
          response.data.success
        ) {
          setComputers(
            (current) => [
              ...current,
              response.data.computer,
            ].sort(
              (a, b) =>
                a.name.localeCompare(
                  b.name,
                  undefined,
                  {
                    numeric: true,
                  }
                )
            )
          );
          setShowAddComputer(false);
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
          "Unable to add computer."
        );
      }
    };

  const handleCreateIssue = (issue) => {
    const cleanDescription = issue.description.trim();
    if (!issue.computerId || !cleanDescription) {
      throw new Error("Select a computer and describe the issue.");
    }
    const computer = computers.find((item) => item._id === issue.computerId);
    if (!computer) throw new Error("Selected computer could not be found.");
    setIssues((current) => [{
      _id: `issue-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      computerId: computer._id,
      computerName: computer.name,
      description: cleanDescription,
      priority: issue.priority,
      status: "Open",
      reportedBy: user.name || user.username,
      createdAt: new Date().toISOString(),
    }, ...current]);
    setShowReportIssue(false);
  };

  const handleResolveIssue = (issueId) => {
    setIssues((current) => current.map((issue) =>
      issue._id === issueId ? { ...issue, status: "Resolved", resolvedAt: new Date().toISOString() } : issue
    ));
  };

  const filteredIssues = issues.filter((issue) => {
    const query = issueSearch.trim().toLowerCase();
    return !query || issue.computerName.toLowerCase().includes(query) || issue.description.toLowerCase().includes(query) || issue.status.toLowerCase().includes(query);
  });

  const handleAddStudent = (student) => {
    const cleanStudent = {
      ...student,
      name: student.name.trim(),
      rollNumber: student.rollNumber.trim().toUpperCase(),
      course: student.course.trim(),
      assignedComputerId: "",
    };

    if (!cleanStudent.name || !cleanStudent.rollNumber || !cleanStudent.course) {
      throw new Error("Please complete all student fields.");
    }

    const exists = students.some(
      (item) =>
        item.rollNumber.toLowerCase() ===
        cleanStudent.rollNumber.toLowerCase()
    );

    if (exists) {
      throw new Error("A student with this roll number already exists.");
    }

    setStudents((current) => [
      ...current,
      {
        ...cleanStudent,
        _id: `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      },
    ]);

    setShowAddStudent(false);
    setStudentError("");
  };

  const handleAssignComputer = (studentId, computerId) => {
    const computer = computers.find(
      (item) => item._id === computerId
    );

    if (!computer) {
      throw new Error("Please select a computer.");
    }

    if (computer.status !== "Available") {
      throw new Error("That computer is no longer available.");
    }

    const currentStudent = students.find(
      (item) => item._id === studentId
    );

    if (!currentStudent) {
      throw new Error("Student could not be found.");
    }

    setStudents((current) =>
      current.map((student) =>
        student._id === studentId
          ? {
              ...student,
              assignedComputerId: computerId,
            }
          : student
      )
    );

    setComputers((current) =>
      current.map((item) =>
        item._id === computerId
          ? { ...item, status: "In Use" }
          : item
      )
    );

    setAssigningStudent(null);
    setStudentError("");
  };

  const handleReleaseComputer = (studentId) => {
    const student = students.find(
      (item) => item._id === studentId
    );

    if (!student?.assignedComputerId) {
      return;
    }

    const releasedComputerId = student.assignedComputerId;

    setStudents((current) =>
      current.map((item) =>
        item._id === studentId
          ? { ...item, assignedComputerId: "" }
          : item
      )
    );

    setComputers((current) =>
      current.map((item) =>
        item._id === releasedComputerId
          ? { ...item, status: "Available" }
          : item
      )
    );
  };

  const filteredStudents = students.filter((student) => {
    const query = studentSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    );
  });

  const availableComputers = computers.filter(
    (computer) => computer.status === "Available"
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-row">
            <div className="brand-mark">
              L
            </div>
            <div>
              <div className="brand-name">
                LABX
              </div>
              <div className="brand-subtitle">
                SMART LAB
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          <SidebarButton
            icon={LayoutDashboard}
            label="Dashboard"
            active={
              activePage ===
              "Dashboard"
            }
            onClick={() =>
              setActivePage(
                "Dashboard"
              )
            }
          />
          <SidebarButton
            icon={Monitor}
            label="Computers"
            active={
              activePage ===
              "Computers"
            }
            onClick={() =>
              setActivePage(
                "Computers"
              )
            }
          />
          {isAdmin && (
            <SidebarButton
              icon={Users}
              label="Students"
              active={
                activePage ===
                "Students"
              }
              onClick={() =>
                setActivePage(
                  "Students"
                )
              }
            />
          )}
          {isAdmin && (
            <SidebarButton
              icon={AlertTriangle}
              label="Issues"
              active={
                activePage ===
                "Issues"
              }
              onClick={() =>
                setActivePage(
                  "Issues"
                )
              }
            />
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-card">
            <div className="profile-avatar">
              {getInitial(
                user.name
              )}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {user.name}
              </div>
              <div className="profile-email">
                {user.email}
              </div>
            </div>
          </div>
          <button
            className="logout-button"
            onClick={() =>
              setShowLogoutConfirm(
                true
              )
            }
          >
            <LogOut size={17} />
            <span>
              Logout
            </span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <div className="content-wrapper">
          <header className="top-header">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Lab system online
              </div>
              <h1>
                {activePage === "Students" ? "Students" : activePage === "Issues" ? "Issues" : "Welcome"}
              </h1>
              <p className="header-description">
                {activePage === "Students"
                  ? "Manage students and their laboratory computer assignments."
                  : activePage === "Issues"
                    ? "Track, review and resolve laboratory computer issues."
                    : isAdmin
                      ? "A simple, beautiful way to manage your laboratory."
                      : "Quickly check computer availability in your laboratory."}
              </p>
            </div>
            <div className="header-right">
              <div className="date-pill">
                Wednesday · 08 October 2026
              </div>
              <div
                className={`role-pill ${
                  isAdmin
                    ? "role-admin"
                    : "role-user"
                }`}
              >
                {user.role}
              </div>
            </div>
          </header>
          {activePage === "Issues" && isAdmin ? (
            <IssuesContent
              issues={filteredIssues}
              allIssues={issues}
              search={issueSearch}
              onSearch={setIssueSearch}
              onReport={() => setShowReportIssue(true)}
              onResolve={handleResolveIssue}
            />
          ) : activePage === "Students" && isAdmin ? (
            <StudentsContent
              students={filteredStudents}
              allStudents={students}
              computers={computers}
              availableComputers={availableComputers}
              search={studentSearch}
              onSearch={setStudentSearch}
              loading={loadingComputers}
              error={studentError}
              onAddStudent={() => {
                setStudentError("");
                setShowAddStudent(true);
              }}
              onAssign={(student) => {
                setStudentError("");
                setAssigningStudent(student);
              }}
              onRelease={handleReleaseComputer}
            />
          ) : isAdmin ? (
            <AdminDashboardContent
              computers={computers}
              statistics={statistics}
              loading={loadingComputers}
              error={computerError}
              onAddComputer={() =>
                setShowAddComputer(
                  true
                )
              }
            />
          ) : (
            <UserDashboardContent
              computers={computers}
              statistics={statistics}
              loading={loadingComputers}
              error={computerError}
            />
          )}
        </div>
      </main>
      {showAddComputer && (
        <AddComputerModal
          computers={computers}
          onClose={() =>
            setShowAddComputer(
              false
            )
          }
          onAdd={handleAddComputer}
        />
      )}
      {showReportIssue && (
        <ReportIssueModal
          computers={computers}
          onClose={() => setShowReportIssue(false)}
          onSubmit={handleCreateIssue}
        />
      )}
      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onAdd={handleAddStudent}
        />
      )}
      {assigningStudent && (
        <AssignComputerModal
          student={assigningStudent}
          computers={availableComputers}
          onClose={() => setAssigningStudent(null)}
          onAssign={handleAssignComputer}
        />
      )}
      {showLogoutConfirm && (
        <LogoutConfirmModal
          onCancel={() =>
            setShowLogoutConfirm(
              false
            )
          }
          onConfirm={onLogout}
        />
      )}
    </div>
  );
}
/* =========================================================
   ADMIN DASHBOARD
========================================================= */
function AdminDashboardContent({
  computers,
  statistics,
  loading,
  error,
  onAddComputer,
}) {
  return (
    <>
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-tag">
            <Sparkles size={14} />
            Lab overview
          </div>
          <h2>
            Everything in your lab,
            <br />
            <span>
              at a glance.
            </span>
          </h2>
          <p>
            Keep track of computers, students
            and laboratory issues from one calm
            workspace.
          </p>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />
          <div className="hero-monitor">
            <div className="monitor-top">
              <span />
              <span />
              <span />
            </div>
            <div className="monitor-content">
              <div className="mini-bar wide" />
              <div className="mini-bar" />
              <div className="mini-grid">
                <div />
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="stats-grid">
        <StatCard
          number={statistics.total}
          label="Total Computers"
          icon={Monitor}
          theme="beige"
        />
        <StatCard
          number={statistics.available}
          label="Available"
          icon={CheckCircle2}
          theme="white"
        />
        <StatCard
          number={statistics.inUse}
          label="Currently In Use"
          icon={Activity}
          theme="taupe"
        />
        <StatCard
          number={statistics.issues}
          label="Needs Attention"
          icon={Wrench}
          theme="silver"
        />
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="section-kicker">
              LAB WORKSTATIONS
            </div>
            <h2>
              Computer status
            </h2>
            <p>
              All computers currently registered
              in the laboratory.
            </p>
          </div>
          <button
            className="add-computer-button"
            onClick={onAddComputer}
          >
            <Plus size={16} />
            Add computer
          </button>
        </div>
        {loading ? (
          <ComputerLoadingGrid />
        ) : error ? (
          <ComputerError
            message={error}
          />
        ) : (
          <div className="computer-grid">
            {computers.map(
              (computer) => (
                <ComputerCard
                  key={computer._id}
                  {...computer}
                />
              )
            )}
          </div>
        )}
      </section>
      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>
                Recent activity
              </h3>
              <p>
                Latest changes in the lab
              </p>
            </div>
            <div className="panel-icon">
              <Activity size={17} />
            </div>
          </div>
          <ActivityRow
            text="Computer inventory synced"
            time="Now"
          />
          <ActivityRow
            text="Computer availability updated"
            time="Today"
          />
          <ActivityRow
            text="Lab system online"
            time="Today"
          />
        </div>
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>
                Active issues
              </h3>
              <p>
                Things that need attention
              </p>
            </div>
            <div className="panel-icon">
              <AlertTriangle size={17} />
            </div>
          </div>
          <IssueRow
            computer="PC-05"
            issue="System not starting"
            priority="High"
          />
          <IssueRow
            computer="PC-11"
            issue="Scheduled maintenance"
            priority="Medium"
          />
          <IssueRow
            computer="PC-24"
            issue="Scheduled maintenance"
            priority="Low"
          />
        </div>
      </section>
    </>
  );
}
/* =========================================================
   USER DASHBOARD
========================================================= */
function UserDashboardContent({
  computers,
  statistics,
  loading,
  error,
}) {
  const [search, setSearch] =
    useState("");
  const availableComputers =
    computers.filter(
      (computer) =>
        computer.status ===
        "Available"
    );
  const filteredComputers =
    availableComputers.filter(
      (computer) =>
        computer.name
          .toLowerCase()
          .includes(
            search
              .toLowerCase()
          )
    );
  return (
    <>
      <section className="user-summary">
        <div className="user-summary-card">
          <div className="user-summary-icon">
            <Monitor size={20} />
          </div>
          <div>
            <div className="user-summary-number">
              {loading
                ? "—"
                : statistics.total}
            </div>
            <div className="user-summary-label">
              Total computers
            </div>
          </div>
        </div>
        <div className="user-summary-card user-summary-available">
          <div className="user-summary-icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="user-summary-number">
              {loading
                ? "—"
                : statistics.available}
            </div>
            <div className="user-summary-label">
              Available now
            </div>
          </div>
        </div>
      </section>
      <section className="user-computers-section">
        <div className="user-section-heading">
          <div>
            <div className="section-kicker">
              LAB WORKSTATIONS
            </div>
            <h2>
              Available computers
            </h2>
            <p>
              Quickly find a computer that is
              ready to use.
            </p>
          </div>
          <div className="computer-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search computer"
            />
          </div>
        </div>
        {loading ? (
          <div className="user-computer-list">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  className="user-computer-skeleton"
                  key={item}
                />
              )
            )}
          </div>
        ) : error ? (
          <ComputerError
            message={error}
          />
        ) : filteredComputers.length ===
          0 ? (
          <div className="empty-computers">
            <Monitor size={20} />
            <div>
              <strong>
                No available computers
              </strong>
              <span>
                There are currently no matching
                available workstations.
              </span>
            </div>
          </div>
        ) : (
          <div className="user-computer-list">
            {filteredComputers.map(
              (computer) => (
                <UserComputerRow
                  key={computer._id}
                  computer={computer}
                />
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}
/* =========================================================
   USER COMPUTER ROW
========================================================= */
function UserComputerRow({
  computer,
}) {
  return (
    <div className="user-computer-row">
      <div className="user-computer-left">
        <div className="user-computer-icon">
          <Monitor size={18} />
        </div>
        <div>
          <div className="user-computer-name">
            {computer.name}
          </div>
          <div className="user-computer-description">
            Lab workstation
          </div>
        </div>
      </div>
      <div className="user-available-badge">
        <span />
        Available
      </div>
    </div>
  );
}
/* =========================================================
   STUDENTS
========================================================= */

function IssuesContent({ issues, allIssues, search, onSearch, onReport, onResolve }) {
  const openCount = allIssues.filter((issue) => issue.status === "Open").length;
  const resolvedCount = allIssues.filter((issue) => issue.status === "Resolved").length;
  return (
    <>
      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Laboratory issues</h2>
            <p>Log computer problems and track their resolution.</p>
          </div>
          <button className="add-computer-button" onClick={onReport}><Plus size={17} /> Report issue</button>
        </div>
        <div className="stats-grid">
          <StatCard number={allIssues.length} label="Total Issues" icon={AlertTriangle} theme="beige" />
          <StatCard number={openCount} label="Open Issues" icon={Activity} theme="white" />
          <StatCard number={resolvedCount} label="Resolved" icon={CheckCircle2} theme="white" />
        </div>
        <div className="user-computers-section panel">
          <div className="user-section-heading issue-register-heading">
            <div className="issue-register-title"><h3>Issue register</h3><p>{issues.length} {issues.length === 1 ? "record" : "records"}</p></div>
            <div className="computer-search issue-search"><Search size={17} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search by computer, description, or status" aria-label="Search issues" /></div>
            <div className="issue-register-spacer" aria-hidden="true" />
          </div>
          {issues.length === 0 ? (
            <div className="empty-computers"><AlertTriangle size={22} /><div><strong>No issues found</strong><span>Report a computer issue to add it to the register.</span></div></div>
          ) : (
            <div className="issues-list">
              {issues.map((issue) => (
                <article className="issue-row" key={issue._id}>
                  <div className="issue-row-main">
                    <div className="user-computer-icon"><Wrench size={18} /></div>
                    <div className="issue-details">
                      <strong>{issue.computerName}</strong>
                      <p>{issue.description}</p>
                      <span>Reported by {issue.reportedBy} · {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="issue-row-actions">
                    <span className={`issue-priority priority-${issue.priority.toLowerCase()}`}>{issue.priority}</span>
                    <span className={`issue-status ${issue.status === "Resolved" ? "issue-resolved" : "issue-open"}`}>{issue.status}</span>
                    {issue.status === "Open" && <button className="cancel-button" onClick={() => onResolve(issue._id)}>Mark resolved</button>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ReportIssueModal({ computers, onClose, onSubmit }) {
  const [computerId, setComputerId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    try {
      setSaving(true);
      onSubmit({ computerId, description, priority });
    } catch (submitError) {
      setError(submitError.message || "Unable to report issue.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="modal-backdrop">
      <div className="add-computer-modal issue-report-modal">
        <div className="modal-header"><div><div className="modal-icon"><Wrench size={19} /></div><div className="issue-modal-kicker">LAB SUPPORT</div><h2>Report an issue</h2><p>Record a problem with a lab computer.</p></div><button className="modal-close" onClick={onClose}><X size={18} /></button></div>
        <form className="computer-form issue-report-form" onSubmit={handleSubmit}>
          <div className="form-field"><label htmlFor="issue-computer">Affected computer</label><select id="issue-computer" className="issue-form-control" value={computerId} onChange={(event) => setComputerId(event.target.value)} required><option value="">Choose a lab computer</option>{computers.map((computer) => <option value={computer._id} key={computer._id}>{computer.name}</option>)}</select></div>
          <div className="form-field"><label htmlFor="issue-description">What went wrong?</label><textarea id="issue-description" className="issue-form-control issue-description-control" rows={4} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the problem and what you noticed..." required /></div>
          <div className="form-field"><label htmlFor="issue-priority">Priority level</label><select id="issue-priority" className="issue-form-control" value={priority} onChange={(event) => setPriority(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select><span className={`issue-priority-hint priority-hint-${priority.toLowerCase()}`}>{priority === "High" ? "Urgent · needs attention soon" : priority === "Low" ? "Low impact · can be handled later" : "Normal · review when available"}</span></div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="save-button" disabled={saving || computers.length === 0}>{saving ? "Saving..." : "Report issue"}</button></div>
          {computers.length === 0 && <p className="form-error">Add a computer before reporting an issue.</p>}
        </form>
      </div>
    </div>
  );
}

function StudentsContent({
  students,
  allStudents,
  computers,
  availableComputers,
  search,
  onSearch,
  loading,
  error,
  onAddStudent,
  onAssign,
  onRelease,
}) {
  return (
    <>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="section-kicker">STUDENT MANAGEMENT</div>
            <h2>Students</h2>
            <p>
              Add students and manage their laboratory computer assignments.
            </p>
          </div>

          <button
            className="add-computer-button"
            onClick={onAddStudent}
          >
            <Plus size={16} />
            Add student
          </button>
        </div>

        <div className="user-summary">
          <div className="user-summary-card">
            <div className="user-summary-icon">
              <Users size={20} />
            </div>
            <div>
              <div className="user-summary-number">{allStudents.length}</div>
              <div className="user-summary-label">Total students</div>
            </div>
          </div>

          <div className="user-summary-card user-summary-available">
            <div className="user-summary-icon">
              <Monitor size={20} />
            </div>
            <div>
              <div className="user-summary-number">{availableComputers.length}</div>
              <div className="user-summary-label">Computers available</div>
            </div>
          </div>
        </div>

        <div className="user-section-heading">
          <div>
            <div className="section-kicker">REGISTERED STUDENTS</div>
            <h2>Student list</h2>
          </div>

          <div className="computer-search">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search student"
            />
          </div>
        </div>

        {loading ? (
          <div className="computer-grid">
            {[1, 2, 3, 4].map((item) => (
              <div className="computer-skeleton" key={item} />
            ))}
          </div>
        ) : error ? (
          <ComputerError message={error} />
        ) : students.length === 0 ? (
          <div className="empty-computers">
            <Users size={20} />
            <div>
              <strong>
                {allStudents.length === 0
                  ? "No students added yet"
                  : "No matching students"}
              </strong>
              <span>
                {allStudents.length === 0
                  ? "Add your first student to start managing computer assignments."
                  : "Try a different name, roll number or course."}
              </span>
            </div>
          </div>
        ) : (
          <div className="computer-grid">
            {students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                computers={computers}
                onAssign={() => onAssign(student)}
                onRelease={() => onRelease(student._id)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function StudentCard({
  student,
  computers,
  onAssign,
  onRelease,
}) {
  const assignedComputer = student.assignedComputerId;
  const hasAssignment = Boolean(assignedComputer);
  const assignedName = hasAssignment
    ? assignedComputer
    : "No computer assigned";

  return (
    <div className="computer-card computer-available">
      <div className="computer-card-top">
        <div className="computer-icon">
          <Users size={19} strokeWidth={1.7} />
        </div>

        <span className="status-pill status-available">
          <span className="status-dot" />
          {hasAssignment ? "Assigned" : "Unassigned"}
        </span>
      </div>

      <div className="computer-name">{student.name}</div>
      <div className="computer-meta">Roll No. {student.rollNumber}</div>
      <div className="computer-meta">{student.course}</div>

      <div className="computer-line">
        <span />
      </div>

      <div className="computer-meta">
        <strong>
          Computer: {hasAssignment
            ? getComputerNameFromId(student.assignedComputerId, computers) || assignedName
            : assignedName}
        </strong>
      </div>

      <div className="modal-actions">
        {hasAssignment ? (
          <button
            type="button"
            className="cancel-button"
            onClick={onRelease}
          >
            Release computer
          </button>
        ) : (
          <button
            type="button"
            className="save-button"
            onClick={onAssign}
            disabled={computers.length === 0}
          >
            <Monitor size={15} />
            {computers.length === 0 ? "No computer available" : "Assign computer"}
          </button>
        )}
      </div>
    </div>
  );
}

function getComputerNameFromId(computerId, computers) {
  return computers.find((computer) => computer._id === computerId)?.name || "";
}

/* =========================================================
   COMPUTERS PAGE
========================================================= */

function ComputersPageContent({
  computers,
  loading,
  error,
  isAdmin,
  onAddComputer,
}) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="section-kicker">LAB WORKSTATIONS</div>
          <h2>Computers</h2>
          <p>All computers currently registered in the laboratory.</p>
        </div>

        {isAdmin && (
          <button className="add-computer-button" onClick={onAddComputer}>
            <Plus size={16} />
            Add computer
          </button>
        )}
      </div>

      {loading ? (
        <ComputerLoadingGrid />
      ) : error ? (
        <ComputerError message={error} />
      ) : (
        <div className="computer-grid">
          {computers.length === 0 ? (
            <div className="empty-computers">
              <Monitor size={20} />
              <div>
                <strong>No computers registered</strong>
                <span>Add a computer to begin managing the laboratory.</span>
              </div>
            </div>
          ) : (
            computers.map((computer) => (
              <ComputerCard key={computer._id} {...computer} />
            ))
          )}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   ISSUES PAGE
========================================================= */

function IssuesPageContent({ computers }) {
  const issues = computers.filter(
    (computer) =>
      computer.status === "Faulty" || computer.status === "Maintenance"
  );

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <div className="section-kicker">LAB MONITORING</div>
          <h2>Issues</h2>
          <p>Computers currently marked for attention.</p>
        </div>
      </div>

      {issues.length === 0 ? (
        <div className="empty-computers">
          <CheckCircle2 size={20} />
          <div>
            <strong>No active computer issues</strong>
            <span>All registered computers are currently clear.</span>
          </div>
        </div>
      ) : (
        <div className="computer-grid">
          {issues.map((computer) => (
            <ComputerCard key={computer._id} {...computer} />
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   ADD STUDENT MODAL
========================================================= */

function AddStudentModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [course, setCourse] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !rollNumber.trim() || !course.trim()) {
      setError("Please complete all student fields.");
      return;
    }

    try {
      setSaving(true);
      onAdd({ name, rollNumber, course });
    } catch (requestError) {
      setError(requestError.message || "Unable to add student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="add-computer-modal">
        <div className="modal-header">
          <div>
            <div className="modal-icon">
              <Users size={19} />
            </div>
            <h2>Add student</h2>
            <p>Register a student for the laboratory.</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="computer-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Student name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Rahul Sharma"
              autoFocus
            />
          </div>

          <div className="form-field">
            <label>Roll number</label>
            <input
              value={rollNumber}
              onChange={(event) => setRollNumber(event.target.value)}
              placeholder="Example: AIML-101"
            />
          </div>

          <div className="form-field">
            <label>Course / class</label>
            <input
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="Example: CSE AI & ML"
            />
          </div>

          {error && (
            <div className="form-error">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Add student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   ASSIGN COMPUTER MODAL
========================================================= */

function AssignComputerModal({
  student,
  computers,
  onClose,
  onAssign,
}) {
  const [selectedComputer, setSelectedComputer] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!selectedComputer) {
      setError("Please select an available computer.");
      return;
    }

    try {
      setSaving(true);
      onAssign(student._id, selectedComputer);
    } catch (requestError) {
      setError(requestError.message || "Unable to assign computer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="add-computer-modal">
        <div className="modal-header">
          <div>
            <div className="modal-icon">
              <Monitor size={19} />
            </div>
            <h2>Assign computer</h2>
            <p>{student.name} · {student.rollNumber}</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="computer-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Available computer</label>
            <div className="custom-select">
              <button
                type="button"
                className="custom-select-trigger"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                <span>
                  {selectedComputer
                    ? getComputerNameFromId(selectedComputer, computers)
                    : "Select a computer"}
                </span>
                <ChevronDown
                  size={16}
                  className={openDropdown ? "select-chevron-open" : ""}
                />
              </button>

              {openDropdown && (
                <div className="custom-select-menu">
                  {computers.map((computer) => (
                    <button
                      type="button"
                      key={computer._id}
                      className={`custom-select-option ${
                        selectedComputer === computer._id
                          ? "custom-select-option-active"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedComputer(computer._id);
                        setOpenDropdown(false);
                      }}
                    >
                      <span className="option-dot" />
                      <span>{computer.name}</span>
                      {selectedComputer === computer._id && (
                        <CheckCircle2 size={15} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {computers.length === 0 && (
            <div className="form-error">
              <AlertTriangle size={14} />
              No available computers right now.
            </div>
          )}

          {error && (
            <div className="form-error">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving || computers.length === 0}
            >
              {saving ? (
                <>
                  <span className="button-spinner" />
                  Assigning...
                </>
              ) : (
                <>
                  <Monitor size={15} />
                  Assign computer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   ADD COMPUTER MODAL
========================================================= */
function AddComputerModal({
  computers,
  onClose,
  onAdd,
}) {
  const [name, setName] =
    useState("");
  const [status, setStatus] =
    useState("Available");
  const [openDropdown, setOpenDropdown] =
    useState(false);
  const [error, setError] =
    useState("");
  const [saving, setSaving] =
    useState(false);
  const handleSubmit =
    async (event) => {
      event.preventDefault();
      setError("");
      const cleanName =
        name
          .trim()
          .toUpperCase();
      if (!cleanName) {
        setError(
          "Please enter a computer name."
        );
        return;
      }
      const exists =
        computers.some(
          (computer) =>
            computer.name
              .toLowerCase() ===
            cleanName.toLowerCase()
        );
      if (exists) {
        setError(
          "A computer with this name already exists."
        );
        return;
      }
      try {
        setSaving(true);
        await onAdd({
          name: cleanName,
          status,
        });
      } catch (error) {
        setError(
          error.message ||
          "Unable to add computer."
        );
      } finally {
        setSaving(false);
      }
    };
  return (
    <div className="modal-backdrop">
      <div className="add-computer-modal">
        <div className="modal-header">
          <div>
            <div className="modal-icon">
              <Monitor size={19} />
            </div>
            <h2>
              Add computer
            </h2>
            <p>
              Register a new lab workstation.
            </p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <form
          className="computer-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label>
              Computer name
            </label>
            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Example: PC-25"
              autoFocus
            />
          </div>
          <div className="form-field">
            <label>
              Status
            </label>
            <div className="custom-select">
              <button
                type="button"
                className="custom-select-trigger"
                onClick={() =>
                  setOpenDropdown(
                    !openDropdown
                  )
                }
              >
                <span>
                  {status}
                </span>
                <ChevronDown
                  size={16}
                  className={
                    openDropdown
                      ? "select-chevron-open"
                      : ""
                  }
                />
              </button>
              {openDropdown && (
                <div className="custom-select-menu">
                  {computerStatuses.map(
                    (option) => (
                      <button
                        type="button"
                        key={option}
                        className={`custom-select-option ${
                          status ===
                          option
                            ? "custom-select-option-active"
                            : ""
                        }`}
                        onClick={() => {
                          setStatus(
                            option
                          );
                          setOpenDropdown(
                            false
                          );
                        }}
                      >
                        <span className="option-dot" />
                        <span>
                          {option}
                        </span>
                        {status ===
                          option && (
                          <CheckCircle2
                            size={15}
                          />
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="form-error">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus size={15} />
                  Add computer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
/* =========================================================
   LOGOUT CONFIRMATION
========================================================= */
function LogoutConfirmModal({
  onCancel,
  onConfirm,
}) {
  return (
    <div className="modal-backdrop">
      <div className="logout-modal">
        <div className="logout-modal-icon">
          <TriangleAlert size={21} />
        </div>
        <h2>
          Log out?
        </h2>
        <p>
          Are you sure you want to log out
          of LabX?
        </p>
        <div className="logout-modal-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="confirm-logout-button"
            onClick={onConfirm}
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   SIDEBAR
========================================================= */
function SidebarButton({
  icon: Icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <button
      className={`sidebar-button ${
        active
          ? "sidebar-button-active"
          : ""
      }`}
      onClick={onClick}
    >
      <span className="sidebar-icon">
        <Icon
          size={17}
          strokeWidth={1.8}
        />
      </span>
      <span>
        {label}
      </span>
      {active && (
        <span className="active-indicator" />
      )}
    </button>
  );
}
/* =========================================================
   STAT CARD
========================================================= */
function StatCard({
  number,
  label,
  icon: Icon,
  theme,
}) {
  return (
    <div
      className={`stat-card stat-${theme}`}
    >
      <div className="stat-top">
        <div className="stat-icon">
          <Icon
            size={18}
            strokeWidth={1.8}
          />
        </div>
        <ArrowUpRight
          size={16}
          className="stat-arrow"
        />
      </div>
      <div className="stat-number">
        {String(number).padStart(
          2,
          "0"
        )}
      </div>
      <div className="stat-label">
        {label}
      </div>
    </div>
  );
}
/* =========================================================
   ADMIN COMPUTER CARD
========================================================= */
function ComputerCard({
  name,
  status,
}) {
  const type =
    getComputerType(status);
  return (
    <div
      className={`computer-card computer-${type}`}
    >
      <div className="computer-card-top">
        <div className="computer-icon">
          <Monitor
            size={19}
            strokeWidth={1.7}
          />
        </div>
        <StatusPill
          status={status}
          type={type}
        />
      </div>
      <div className="computer-name">
        {name}
      </div>
      <div className="computer-meta">
        Lab workstation
      </div>
      <div className="computer-line">
        <span />
      </div>
    </div>
  );
}
/* =========================================================
   STATUS PILL
========================================================= */
function StatusPill({
  status,
  type,
}) {
  return (
    <span
      className={`status-pill status-${type}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  );
}
/* =========================================================
   ACTIVITY
========================================================= */
function ActivityRow({
  text,
  time,
}) {
  return (
    <div className="activity-row">
      <div className="activity-left">
        <span className="activity-dot" />
        <span>
          {text}
        </span>
      </div>
      <span className="activity-time">
        {time}
      </span>
    </div>
  );
}
/* =========================================================
   ISSUE
========================================================= */
function IssueRow({
  computer,
  issue,
  priority,
}) {
  return (
    <div className="issue-row">
      <div className="issue-left">
        <span className="issue-computer">
          {computer}
        </span>
        <span className="issue-separator">
          ·
        </span>
        <span className="issue-name">
          {issue}
        </span>
      </div>
      <span
        className={`priority priority-${priority.toLowerCase()}`}
      >
        {priority}
      </span>
    </div>
  );
}
/* =========================================================
   LOADING GRID
========================================================= */
function ComputerLoadingGrid() {
  return (
    <div className="computer-grid">
      {Array.from({
        length: 8,
      }).map((_, index) => (
        <div
          className="computer-skeleton"
          key={index}
        />
      ))}
    </div>
  );
}
/* =========================================================
   ERROR
========================================================= */
function ComputerError({
  message,
}) {
  return (
    <div className="computer-error">
      <AlertTriangle size={19} />
      <div>
        <strong>
          Unable to load computers
        </strong>
        <span>
          {message}
        </span>
      </div>
    </div>
  );
}
/* =========================================================
   LOADING
========================================================= */
function LoadingScreen() {
  return (
    <div className="loading-page">
      <div className="loading-mark">
        L
      </div>
      <div className="loading-name">
        LABX
      </div>
      <div className="loading-line">
        <span />
      </div>
    </div>
  );
}
/* =========================================================
   HELPERS
========================================================= */
function getInitial(name) {
  if (!name) {
    return "L";
  }
  return name
    .trim()
    .charAt(0)
    .toUpperCase();
}
function getComputerType(status) {
  if (
    status === "Available"
  ) {
    return "available";
  }
  if (
    status === "In Use"
  ) {
    return "use";
  }
  if (
    status === "Maintenance"
  ) {
    return "maintenance";
  }
  return "faulty";
}
export default App;
