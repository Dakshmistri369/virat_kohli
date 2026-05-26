import { useState } from 'react';
import { Calendar, Award, Star, Flame, Trophy, Crown } from 'lucide-react';

const MilestonesTimeline = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const milestones = [
    {
      year: "2008",
      title: "Under-19 World Cup Glory & ODI Debut",
      description: "Captained the Indian U-19 team to a World Cup victory in Malaysia. Made his ODI debut for India against Sri Lanka in August.",
      icon: Trophy,
      type: "national"
    },
    {
      year: "2011",
      title: "ICC World Cup Champion",
      description: "Scored a crucial century in the opening match against Bangladesh. Played a key partnership with Gautam Gambhir in the final against Sri Lanka to help India lift the World Cup after 28 years.",
      icon: Star,
      type: "international"
    },
    {
      year: "2014",
      title: "Test Captaincy Inauguration",
      description: "Took over the Test captaincy in Australia. Went on to score four centuries in the series, launching India's most successful Test captaincy era.",
      icon: Crown,
      type: "international"
    },
    {
      year: "2016",
      title: "The Dream IPL Campaign",
      description: "Amassed an unbelievable 973 runs in a single IPL edition with 4 centuries, carrying Royal Challengers Bengaluru to the tournament finals.",
      icon: Flame,
      type: "rcb"
    },
    {
      year: "2023",
      title: "50th ODI Century (The King's Realm)",
      description: "Scored his 50th One Day International century in the World Cup Semi-Final against New Zealand at Wankhede Stadium, breaking Sachin Tendulkar's historic record of 49 centuries in front of the master himself.",
      icon: Award,
      type: "international"
    },
    {
      year: "2024",
      title: "T20 World Cup Triumph & Retirement",
      description: "Played a match-winning 76 in the final against South Africa to lead India to the T20 World Cup Trophy, claiming Player of the Match and announcing his retirement from T20Is at the peak.",
      icon: Trophy,
      type: "international"
    }
  ];

  return (
    <div className="milestones-timeline-section">
      <div className="section-header">
        <span className="accent-bar" />
        <h2>THE CHRONICLES OF KING KOHLI</h2>
        <p>A look back at the historic milestones that defined a cricketing generation</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-line" />
        
        {milestones.map((milestone, index) => {
          const Icon = milestone.icon;
          const isEven = index % 2 === 0;
          
          return (
            <div 
              key={milestone.year} 
              className={`timeline-item ${isEven ? 'left' : 'right'} ${selectedMilestone === index ? 'active' : ''}`}
              onClick={() => setSelectedMilestone(selectedMilestone === index ? null : index)}
            >
              <div className="timeline-dot-wrapper">
                <div className={`timeline-dot ${milestone.type}`}>
                  <Icon size={16} />
                </div>
              </div>

              <div className="timeline-content-card">
                <div className="timeline-year-tag">{milestone.year}</div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <div className={`timeline-card-glow ${milestone.type}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestonesTimeline;
