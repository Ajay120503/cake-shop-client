import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => (
  <div className="container-custom py-20 text-center">
    <div className="text-9xl mb-4">🎂</div>
    <h1 className="text-6xl font-display font-bold gradient-text mb-3">404</h1>
    <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
    <p className="text-gray-600 mb-6">
      The cake you're looking for seems to have been moved or doesn't exist.
    </p>
    <Link to="/" className="btn-primary inline-flex">
      <Home size={16} className="mr-2" /> Back to Home
    </Link>
  </div>
);

export default NotFound;
