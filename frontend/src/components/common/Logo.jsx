const Logo = ({ size = 36, className = '' }) => (
  <img
    src="/logo.svg"
    alt="BellCorp Logo"
    width={size}
    height={size}
    className={className}
    style={{ objectFit: 'contain' }}
  />
);

export default Logo;
