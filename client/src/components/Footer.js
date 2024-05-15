import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from 'react-icons/fa';
import '../resourses/footer.css';

const Footer = () => {
  return (
    <div className="parent">
      <div className="footer-body">
        <p>Copyright © 2023 BagTrack</p>
        <div>
          <p>Find us in social media</p>
          <div className="d-flex gap-1">
            <FaFacebookSquare className="icons" />
            <FaInstagramSquare className="icons" />
            <FaTwitterSquare className="icons" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
