import Words from './Words';
import Images from './Images';
import '../styles/index.scss';

export default function App() {
  return (
    <>
      <h1 className="animate-font">Hello from react</h1>
      <Words />
      <Images />
    </>
  );
}
