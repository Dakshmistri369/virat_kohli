import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Target, Award as CenturyIcon, Zap, Shield, Flame, Activity } from 'lucide-react';

const RecordsPanel = () => {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('Overall');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/api/records`);
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        setRecords(data);
        setLoading(false);
      } catch (err) {
        console.warn('Backend fetch failed, falling back to static record set:', err.message);
        
        // Elite fallback: If backend isn't reachable or fails, use local copy of seed data
        const localData = [
          { format: "Test", matches: 113, innings: 191, runs: 8848, average: 49.15, strikeRate: 55.56, highestScore: "254*", centuries: 29, halfCenturies: 30, fours: 991, sixes: 26, doubleCenturies: 7, wickets: 0, catches: 111 },
          { format: "ODI", matches: 295, innings: 283, runs: 13906, average: 58.18, strikeRate: 93.54, highestScore: "183", centuries: 50, halfCenturies: 72, fours: 1302, sixes: 152, doubleCenturies: 0, wickets: 5, catches: 151 },
          { format: "T20I", matches: 125, innings: 117, runs: 4188, average: 48.69, strikeRate: 137.04, highestScore: "122*", centuries: 1, halfCenturies: 38, fours: 369, sixes: 124, doubleCenturies: 0, wickets: 4, catches: 54 },
          { format: "IPL", matches: 268, innings: 259, runs: 8004, average: 38.66, strikeRate: 131.97, highestScore: "113*", centuries: 8, halfCenturies: 55, fours: 705, sixes: 270, doubleCenturies: 0, wickets: 4, catches: 114 },
          { format: "Overall", matches: 801, innings: 850, runs: 34946, average: 48.74, strikeRate: 98.45, highestScore: "254*", centuries: 88, halfCenturies: 195, fours: 3367, sixes: 572, doubleCenturies: 7, wickets: 13, catches: 430 }
        ];
        setRecords(localData);
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const triggerCelebration = () => {
    // School pride: Gold and Red confetti colors representing RCB!
    const colors = ['#ff1e27', '#ecb22e', '#ffffff'];
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const getFormatHighlight = (format) => {
    switch (format) {
      case 'Test':
        return "7 Double Centuries - Most by an Indian in Test history.";
      case 'ODI':
        return "50 Centuries - Surpassed Sachin Tendulkar for the most ODI Hundreds ever!";
      case 'T20I':
        return "122* Highest T20I Score - Legend of the short format, T20 World Cup Champion.";
      case 'IPL':
        return "973 Runs in a Single Season (2016) - World Record. 8 IPL Centuries (All-time high).";
      default:
        return "88 International & IPL Centuries, 34,946+ runs across formats. The ultimate Chase Master.";
    }
  };

  if (loading) {
    return (
      <div className="records-loading">
        <div className="loader-spinner" />
        <p>Loading stats database...</p>
      </div>
    );
  }

  const currentRecord = records.find(r => r.format === activeTab) || records[0];

  return (
    <div className="records-section">
      <div className="section-header">
        <span className="accent-bar" />
        <h2>THE RECORD BOOKS</h2>
        <p>Real-time statistics synced with career database</p>
      </div>

      {/* Tabs */}
      <div className="records-tabs-container">
        <div className="records-tabs">
          {records.map(rec => (
            <button
              key={rec.format}
              className={`tab-btn ${activeTab === rec.format ? 'active' : ''}`}
              onClick={() => setActiveTab(rec.format)}
            >
              {rec.format}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Display Grid */}
      {currentRecord && (
        <div className="stats-showcase">
          
          <div className="stats-main-card">
            <div className="runs-stat">
              <span className="stat-label">Total Runs</span>
              <h3 className="runs-number gold-glow">{currentRecord.runs.toLocaleString()}</h3>
            </div>
            
            <div className="milestone-ribbon" onClick={triggerCelebration}>
              <Award className="award-icon pulse" />
              <span>{getFormatHighlight(currentRecord.format)}</span>
              <button className="celebrate-btn">Celebrate</button>
            </div>

            <div className="metric-quick-grid">
              <div className="metric-box">
                <span className="metric-title">Matches</span>
                <span className="metric-val">{currentRecord.matches}</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Innings</span>
                <span className="metric-val">{currentRecord.innings}</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Highest Score</span>
                <span className="metric-val text-red">{currentRecord.highestScore}</span>
              </div>
            </div>
          </div>

          <div className="stats-sub-grid">
            {/* Average Card */}
            <div className="stat-mini-card">
              <div className="stat-mini-header">
                <Activity size={18} className="text-red" />
                <span>Batting Average</span>
              </div>
              <div className="stat-mini-body">
                <span className="huge-val">{currentRecord.average}</span>
                <div className="average-bar-container">
                  <div className="average-bar" style={{ width: `${Math.min(currentRecord.average * 1.5, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Strike Rate Card */}
            <div className="stat-mini-card">
              <div className="stat-mini-header">
                <Zap size={18} className="text-gold" />
                <span>Strike Rate</span>
              </div>
              <div className="stat-mini-body">
                <span className="huge-val">{currentRecord.strikeRate}</span>
                <div className="average-bar-container">
                  <div className="average-bar gold" style={{ width: `${Math.min(currentRecord.strikeRate / 1.5, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Century / Half Century Card */}
            <div className="stat-mini-card double-width">
              <div className="stat-mini-header">
                <Flame size={18} className="text-red" />
                <span>Milestone Counts</span>
              </div>
              <div className="milestone-counts-grid">
                <div className="milestone-sub-box">
                  <span className="milestone-badge gold">100s</span>
                  <span className="milestone-num">{currentRecord.centuries}</span>
                </div>
                <div className="milestone-sub-box">
                  <span className="milestone-badge red">50s</span>
                  <span className="milestone-num">{currentRecord.halfCenturies}</span>
                </div>
                {currentRecord.doubleCenturies > 0 && (
                  <div className="milestone-sub-box">
                    <span className="milestone-badge white">200s</span>
                    <span className="milestone-num">{currentRecord.doubleCenturies}</span>
                  </div>
                )}
                <div className="milestone-sub-box">
                  <span className="milestone-badge grey">Fours</span>
                  <span className="milestone-num">{currentRecord.fours}</span>
                </div>
                <div className="milestone-sub-box">
                  <span className="milestone-badge grey">Sixes</span>
                  <span className="milestone-num">{currentRecord.sixes}</span>
                </div>
              </div>
            </div>

            {/* Fielding & Bowling Card */}
            <div className="stat-mini-card">
              <div className="stat-mini-header">
                <Shield size={18} className="text-white" />
                <span>Defense & Catches</span>
              </div>
              <div className="defense-details">
                <div className="def-row">
                  <span>Catches Taken</span>
                  <span className="def-val">{currentRecord.catches}</span>
                </div>
                <div className="def-row">
                  <span>Wickets Taken</span>
                  <span className="def-val">{currentRecord.wickets}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RecordsPanel;
