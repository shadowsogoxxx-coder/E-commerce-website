import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t bg-background">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold">DigitalStore</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Premium digital products for creators and professionals.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Links</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/products" className="hover:text-foreground transition-colors">Products</Link></li>
            <li><Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Account</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} DigitalStore. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
