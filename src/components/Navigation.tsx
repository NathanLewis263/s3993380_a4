import { Button, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Navigation = () => {
  const router = useRouter();
  return (
    <nav className="h-12 flex gap-20 justify-center items-center bg-[black] drop-shadow-xl">
      <Link textDecoration="none" color="white" fontSize="20px" href="/" _hover={{ color: "#9EA3A6"}}>
        Home
      </Link>
    </nav>
  );
};

export default Navigation;
