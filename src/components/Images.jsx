import gif from '../img/gif.gif';
import jpeg from '../img/jpeg.jpg';
import png from '../img/png.png';
import svg from '../img/svg.svg';

export default function Images() {
  return (
    <ul>
      <li>
        <img src={gif} alt="images" />
      </li>
      <li>
        <img src={jpeg} alt="images" />
      </li>
      <li>
        <img src={png} alt="images" />
      </li>
      <li>
        <img src={svg} alt="images" />
      </li>
      <li className="item-bg" />
    </ul>
  );
}
