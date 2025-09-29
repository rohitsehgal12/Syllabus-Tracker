import "./ProgressBar.css";

export default function ProgressBar({ completed, total }) {
  const percentage = Math.round((completed / total) * 100);

  return (
     <div className="progress-wrapper">
      <p className="progress-text">
        Progress: {completed}/{total} ({percentage}%)
      </p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-label">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
