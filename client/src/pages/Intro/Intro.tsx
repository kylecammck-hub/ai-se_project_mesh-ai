import { useNavigate } from 'react-router-dom';
import './Intro.css';

// Export each icon from Figma (Intro page > Card > Intro > Onboarding cards > Card > Icon)
// as a PNG at 106px wide and drop it into client/public/images/.
const FEATURES = [
  {
    icon: '/images/intro-icon-documents.png',
    text: 'Bring all your documents into one secure AI workspace',
  },
  {
    icon: '/images/intro-icon-organize.png',
    text: 'Organize and manage the documents that power your AI',
  },
  {
    icon: '/images/intro-icon-chat.png',
    text: 'Your knowledge base, accessible through a simple chat interface',
  },
];

export default function Intro() {
  const navigate = useNavigate();

  function handleStart() {
    navigate('/knowledge');
  }

  return (
    <section className="intro">
      <h1 className="intro__title">
        Welcome to Mesh AI
        <span className="intro__title-icon" aria-hidden="true" />
      </h1>

      <ul className="intro__cards">
        {FEATURES.map((feature) => (
          <li className="intro__card" key={feature.text}>
            <img
              className="intro__card-icon"
              src={feature.icon}
              alt=""
              width={106}
            />
            <p className="intro__card-text">{feature.text}</p>
          </li>
        ))}
      </ul>

      <div className="intro__cta">
        <p className="intro__instruction">
          Start by creating your Organization&apos;s Knowledge Base
        </p>
        <button className="intro__button" type="button" onClick={handleStart}>
          Start
        </button>
      </div>
    </section>
  );
}
