import { useNavigate } from 'react-router-dom';
import { LogoMark, DocumentsIcon, FolderIcon, SparkleStackIcon } from '../../components/icons/Icons';
import './Intro.css';

const FEATURES = [
  {
    Icon: DocumentsIcon,
    text: 'Bring all your documents into one secure AI workspace',
  },
  {
    Icon: FolderIcon,
    text: 'Organize and manage the documents that power your AI',
  },
  {
    Icon: SparkleStackIcon,
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
        <LogoMark className="intro__title-icon" />
      </h1>

      <ul className="intro__cards">
        {FEATURES.map(({ Icon, text }) => (
          <li className="intro__card" key={text}>
            <Icon className="intro__card-icon" />
            <p className="intro__card-text">{text}</p>
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
