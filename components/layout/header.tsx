import Link from "next/link";
import Brand from "../brand/brand";
import CartButton from "../cart/cart-buttons/cart-count";

const Header = () => {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#ffd700]/75 backdrop-blur-md shadow-sm rounded-xl px-6 py-3 w-[92%] max-w-[500px]">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Brand />
        </Link>
        <CartButton />
      </div>
    </header>
  );
};

export default Header;
