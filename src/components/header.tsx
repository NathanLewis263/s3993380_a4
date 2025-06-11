import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  return (
    <header className="header">
      <h1 className="logo" onClick={() => router.push("/")}>
        SampleAirbnb
      </h1>
    </header>
  );
};

export default Header;
